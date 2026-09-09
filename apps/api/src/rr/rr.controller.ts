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
import { Role, RrStatus } from '../generated/prisma/client.js';
import { Roles } from '../common/roles.decorator.js';
import { RolesGuard } from '../common/roles.guard.js';
import { CreateRrCaseDto } from './dto/create-rr-case.dto.js';
import { RrService } from './rr.service.js';
import { UpdateRrCaseDto } from './dto/update-rr-case.dto.js';

interface AuthUser {
  id: string;
}

@Controller('r-and-r')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RrController {
  constructor(private readonly rrService: RrService) {}

  @Get()
  list(
    @Query('projectId') projectId?: string,
    @Query('familyId') familyId?: string,
    @Query('status') status?: RrStatus,
  ) {
    return this.rrService.list(projectId, familyId, status);
  }

  @Post()
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  create(@Body() dto: CreateRrCaseDto, @CurrentUser() user: AuthUser) {
    return this.rrService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRrCaseDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.rrService.update(id, dto, user.id);
  }
}
