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
import { Role } from '../generated/prisma/client.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { RolesGuard } from '../common/roles.guard.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectsService } from './projects.service.js';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  list(@Query() query: ListProjectsQueryDto) {
    return this.projectsService.list(query);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.projectsService.get(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER)
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  @Roles(
    Role.ADMIN,
    Role.CENTRAL_OFFICER,
    Role.STATE_OFFICER,
    Role.DISTRICT_OFFICER,
  )
  patch(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }
}
