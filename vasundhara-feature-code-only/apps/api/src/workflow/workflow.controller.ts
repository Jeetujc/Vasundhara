import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import { WorkflowService } from './workflow.service.js';
import { StartWorkflowDto } from './dto/start-workflow.dto.js';
import { CompleteTaskDto } from './dto/complete-task.dto.js';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('workflows')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  start(@Body() dto: StartWorkflowDto, @CurrentUser() user: RequestUser) {
    return this.workflowService.start(dto, user);
  }

  @Get('workflows/:projectId')
  forProject(@Param('projectId') projectId: string) {
    return this.workflowService.findForProject(projectId);
  }

  @Get('workflows/:id/tasks')
  tasks(@Param('id') id: string) {
    return this.workflowService.getTasks(id);
  }

  @Patch('workflow-tasks/:id/complete')
  completeTask(
    @Param('id') id: string,
    @Body() dto: CompleteTaskDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workflowService.completeTask(id, dto, user);
  }
}
