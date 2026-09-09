import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ProjectStatus,
  WorkflowStatus,
  WorkflowTaskStatus,
} from '../generated/prisma/client.js';
import { AuditService } from '../audit/audit.service.js';
import {
  getNextWorkflowStage,
  STAGE_PROJECT_STATUS,
  WORKFLOW_STAGES,
} from '../common/workflow.constants.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CompleteTaskDto } from './dto/complete-task.dto.js';
import { StartWorkflowDto } from './dto/start-workflow.dto.js';

@Injectable()
export class WorkflowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async list(projectId?: string) {
    return this.prisma.workflowInstance.findMany({
      where: {
        projectId,
      },
      include: {
        project: {
          select: { id: true, name: true, code: true, status: true },
        },
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listTasks(workflowId?: string, assignedToId?: string) {
    return this.prisma.workflowTask.findMany({
      where: {
        workflowId,
        assignedToId,
      },
      include: {
        workflow: {
          select: { id: true, currentStage: true, projectId: true },
        },
      },
      orderBy: [{ deadline: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async start(dto: StartWorkflowDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      select: { id: true, name: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const existing = await this.prisma.workflowInstance.findFirst({
      where: {
        projectId: dto.projectId,
        status: { in: [WorkflowStatus.NOT_STARTED, WorkflowStatus.IN_PROGRESS] },
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Workflow already active for this project');
    }

    const firstStage = WORKFLOW_STAGES[0];

    const workflow = await this.prisma.$transaction(async (tx) => {
      const createdWorkflow = await tx.workflowInstance.create({
        data: {
          projectId: dto.projectId,
          currentStage: firstStage,
          status: WorkflowStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
      });

      await tx.workflowTask.create({
        data: {
          workflowId: createdWorkflow.id,
          stage: firstStage,
          title: `Complete stage: ${firstStage}`,
          assignedToId: dto.assignedToId,
          deadline: dto.deadline ? new Date(dto.deadline) : null,
          status: WorkflowTaskStatus.PENDING,
        },
      });

      await tx.project.update({
        where: { id: dto.projectId },
        data: {
          status: STAGE_PROJECT_STATUS[firstStage],
        },
      });

      return createdWorkflow;
    });

    await this.auditService.create({
      action: 'WORKFLOW_STARTED',
      entityType: 'WorkflowInstance',
      entityId: workflow.id,
      projectId: dto.projectId,
      description: `Workflow started at stage ${firstStage}`,
      metadata: { stage: firstStage },
    });

    if (dto.assignedToId) {
      await this.notificationsService.create(
        dto.assignedToId,
        'New workflow task assigned',
        `You have been assigned workflow stage ${firstStage} for project ${project.name}.`,
      );
    }

    return this.getById(workflow.id);
  }

  async completeTask(taskId: string, dto: CompleteTaskDto, actorId: string) {
    const task = await this.prisma.workflowTask.findUnique({
      where: { id: taskId },
      include: {
        workflow: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Workflow task not found');
    }

    if (
      task.status !== WorkflowTaskStatus.PENDING &&
      task.status !== WorkflowTaskStatus.IN_PROGRESS
    ) {
      throw new BadRequestException('Only pending/in-progress tasks can be completed');
    }

    if (task.stage !== task.workflow.currentStage) {
      throw new BadRequestException('Task stage does not match current workflow stage');
    }

    const nextStage = getNextWorkflowStage(task.stage);
    const completedAt = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.workflowTask.update({
        where: { id: task.id },
        data: {
          status: WorkflowTaskStatus.COMPLETED,
          completedAt,
        },
      });

      if (nextStage) {
        await tx.workflowTask.create({
          data: {
            workflowId: task.workflowId,
            stage: nextStage,
            title: `Complete stage: ${nextStage}`,
            assignedToId: dto.nextAssignedToId,
            deadline: dto.nextDeadline ? new Date(dto.nextDeadline) : null,
            status: WorkflowTaskStatus.PENDING,
          },
        });

        await tx.workflowInstance.update({
          where: { id: task.workflowId },
          data: {
            currentStage: nextStage,
            status: WorkflowStatus.IN_PROGRESS,
          },
        });

        await tx.project.update({
          where: { id: task.workflow.projectId },
          data: { status: STAGE_PROJECT_STATUS[nextStage] },
        });
      } else {
        await tx.workflowInstance.update({
          where: { id: task.workflowId },
          data: {
            status: WorkflowStatus.COMPLETED,
            completedAt,
          },
        });

        await tx.project.update({
          where: { id: task.workflow.projectId },
          data: { status: ProjectStatus.CLOSED, closureDate: completedAt },
        });
      }

      return tx.workflowInstance.findUnique({
        where: { id: task.workflowId },
      });
    });

    await this.auditService.create({
      action: 'WORKFLOW_TASK_COMPLETED',
      entityType: 'WorkflowTask',
      entityId: task.id,
      userId: actorId,
      projectId: task.workflow.projectId,
      description: dto.remarks ?? `${task.stage} completed`,
      metadata: {
        completedStage: task.stage,
        nextStage,
      },
    });

    if (dto.nextAssignedToId && nextStage) {
      await this.notificationsService.create(
        dto.nextAssignedToId,
        'Workflow task assigned',
        `You have been assigned ${nextStage} for workflow ${task.workflowId}.`,
      );
    }

    return result;
  }

  async getById(id: string) {
    const workflow = await this.prisma.workflowInstance.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }
}
