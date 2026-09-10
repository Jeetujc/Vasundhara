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
import { GrievancesService } from './grievances.service.js';
import { CreateGrievanceDto } from './dto/create-grievance.dto.js';
import { UpdateGrievanceDto } from './dto/update-grievance.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { GrievanceStatus, Role } from '../generated/prisma/client.js';

interface AuthUser {
  id: string;
  role: Role;
  stateId?: string;
  districtId?: string;
}

@Controller('grievances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  @Post()
  create(@Body() dto: CreateGrievanceDto, @CurrentUser() user: AuthUser) {
    return this.grievancesService.create(dto, user.id);
  }

  @Get('mine')
  listMine(@CurrentUser() user: AuthUser) {
    return this.grievancesService.listMine(user.id);
  }

  @Get()
  @Roles(
    Role.ADMIN,
    Role.CENTRAL_OFFICER,
    Role.STATE_OFFICER,
    Role.DISTRICT_OFFICER,
  )
  list(
    @CurrentUser() user: AuthUser,
    @Query('projectId') projectId?: string,
    @Query('status') status?: GrievanceStatus,
  ) {
    return this.grievancesService.list(user, projectId, status);
  }

  @Get(':id')
  getById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.grievancesService.getById(id, user);
  }

  @Patch(':id/status')
  @Roles(
    Role.ADMIN,
    Role.CENTRAL_OFFICER,
    Role.STATE_OFFICER,
    Role.DISTRICT_OFFICER,
  )
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateGrievanceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.grievancesService.updateStatus(id, dto, user.id);
  }
}
