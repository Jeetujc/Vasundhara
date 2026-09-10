import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '../generated/prisma/client.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { RolesGuard } from '../common/roles.guard.js';
import { CompleteTaskDto } from './dto/complete-task.dto.js';
import { StartWorkflowDto } from './dto/start-workflow.dto.js';
import { WorkflowService } from './workflow.service.js';

interface AuthUser {
  id: string;
  role: Role;
}

@Controller('workflow')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get()
  list(@Query('projectId') projectId?: string) {
    return this.workflowService.list(projectId);
  }

  @Get('tasks')
  listTasks(
    @Query('workflowId') workflowId?: string,
    @Query('assignedToId') assignedToId?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.workflowService.listTasks(workflowId, assignedToId, user);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.workflowService.getById(id);
  }

  @Post('start')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  start(@Body() dto: StartWorkflowDto) {
    return this.workflowService.start(dto);
  }

  @Patch('tasks/:taskId/complete')
  @Roles(
    Role.ADMIN,
    Role.CENTRAL_OFFICER,
    Role.STATE_OFFICER,
    Role.DISTRICT_OFFICER,
    Role.FIELD_OFFICER,
  )
  completeTask(
    @Param('taskId') taskId: string,
    @Body() dto: CompleteTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.workflowService.completeTask(taskId, dto, user);
  }
}
