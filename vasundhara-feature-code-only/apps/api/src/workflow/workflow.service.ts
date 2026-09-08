import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WorkflowStatus, WorkflowTaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import type { StartWorkflowDto } from './dto/start-workflow.dto.js';
import type { CompleteTaskDto } from './dto/complete-task.dto.js';

// The fixed stage sequence from the project roadmap:
// Proposal -> Scrutiny -> Approval -> Notification -> Objections -> Award
// -> Compensation -> Possession -> R&R -> Closure.
// `currentStage` on WorkflowInstance is a plain string column, so this array
// is the single source of truth for what stage comes after what.
export const STAGE_SEQUENCE = [
  'PROPOSAL',
  'SCRUTINY',
  'APPROVAL',
  'NOTIFICATION',
  'OBJECTIONS',
  'AWARD',
  'COMPENSATION',
  'POSSESSION',
  'R_AND_R',
  'CLOSURE',
] as const;

@Injectable()
export class WorkflowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  async start(dto: StartWorkflowDto, user: RequestUser) {
    const existing = await this.prisma.workflowInstance.findFirst({
      where: { projectId: dto.projectId },
    });
    if (existing) {
      throw new BadRequestException('A workflow already exists for this project');
    }

    const firstStage = STAGE_SEQUENCE[0];

    const workflow = await this.prisma.workflowInstance.create({
      data: {
        projectId: dto.projectId,
        currentStage: firstStage,
        status: WorkflowStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });

    const task = await this.prisma.workflowTask.create({
      data: {
        workflowId: workflow.id,
        stage: firstStage,
        title: `${firstStage} for project`,
        assignedToId: dto.assignedToId,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      },
    });

    await this.audit.log({
      userId: user.userId,
      action: 'WORKFLOW_STARTED',
      entityType: 'WorkflowInstance',
      entityId: workflow.id,
      projectId: dto.projectId,
      description: `Workflow started at stage ${firstStage}`,
    });

    if (dto.assignedToId) {
      await this.notifications.create(
        dto.assignedToId,
        'New task assigned',
        `You have been assigned the ${firstStage} task for this project.`,
      );
    }

    return { workflow, task };
  }

  findForProject(projectId: string) {
    return this.prisma.workflowInstance.findMany({
      where: { projectId },
      include: { tasks: true },
    });
  }

  async getTasks(workflowId: string) {
    const workflow = await this.prisma.workflowInstance.findUnique({ where: { id: workflowId } });
    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }
    return this.prisma.workflowTask.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async completeTask(taskId: string, dto: CompleteTaskDto, user: RequestUser) {
    const task = await this.prisma.workflowTask.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.status === WorkflowTaskStatus.COMPLETED) {
      throw new BadRequestException('Task is already completed');
    }

    const workflow = await this.prisma.workflowInstance.findUnique({
      where: { id: task.workflowId },
    });
    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    await this.prisma.workflowTask.update({
      where: { id: taskId },
      data: { status: WorkflowTaskStatus.COMPLETED, completedAt: new Date() },
    });

    await this.audit.log({
      userId: user.userId,
      action: 'WORKFLOW_TASK_COMPLETED',
      entityType: 'WorkflowTask',
      entityId: task.id,
      projectId: workflow.projectId,
      description: `Completed stage ${workflow.currentStage}`,
    });

    const currentIndex = STAGE_SEQUENCE.indexOf(
      workflow.currentStage as (typeof STAGE_SEQUENCE)[number],
    );
    const nextStage = STAGE_SEQUENCE[currentIndex + 1];

    // No next stage -> this was Closure. Mark the whole workflow complete.
    if (!nextStage) {
      const closedWorkflow = await this.prisma.workflowInstance.update({
        where: { id: workflow.id },
        data: { status: WorkflowStatus.COMPLETED, completedAt: new Date() },
      });
      return { workflow: closedWorkflow, nextTask: null };
    }

    const updatedWorkflow = await this.prisma.workflowInstance.update({
      where: { id: workflow.id },
      data: { currentStage: nextStage },
    });

    const nextTask = await this.prisma.workflowTask.create({
      data: {
        workflowId: workflow.id,
        stage: nextStage,
        title: `${nextStage} for project`,
        assignedToId: dto.nextAssignedToId,
        deadline: dto.nextDeadline ? new Date(dto.nextDeadline) : undefined,
      },
    });

    if (dto.nextAssignedToId) {
      await this.notifications.create(
        dto.nextAssignedToId,
        'New task assigned',
        `You have been assigned the ${nextStage} task for this project.`,
      );
    }

    return { workflow: updatedWorkflow, nextTask };
  }
}
