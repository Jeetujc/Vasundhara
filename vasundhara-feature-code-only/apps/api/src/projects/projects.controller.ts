import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.projectsService.findAll(user);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.projectsService.findOne(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: RequestUser) {
    return this.projectsService.create(dto, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  patch(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.projectsService.update(id, dto, user);
  }
}
