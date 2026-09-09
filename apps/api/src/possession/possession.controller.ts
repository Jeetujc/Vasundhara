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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Role, PossessionStatus } from '../generated/prisma/client.js';
import { Roles } from '../common/roles.decorator.js';
import { RolesGuard } from '../common/roles.guard.js';
import { CreatePossessionRecordDto } from './dto/create-possession-record.dto.js';
import { PossessionService } from './possession.service.js';
import { UpdatePossessionRecordDto } from './dto/update-possession-record.dto.js';

interface AuthUser {
  id: string;
}

@Controller('possession')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PossessionController {
  constructor(private readonly possessionService: PossessionService) {}

  @Get()
  list(
    @Query('projectId') projectId?: string,
    @Query('status') status?: PossessionStatus,
  ) {
    return this.possessionService.list(projectId, status);
  }

  @Post()
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  create(@Body() dto: CreatePossessionRecordDto, @CurrentUser() user: AuthUser) {
    return this.possessionService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles(
    Role.ADMIN,
    Role.CENTRAL_OFFICER,
    Role.STATE_OFFICER,
    Role.DISTRICT_OFFICER,
    Role.FIELD_OFFICER,
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePossessionRecordDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.possessionService.update(id, dto, user.id);
  }
}
