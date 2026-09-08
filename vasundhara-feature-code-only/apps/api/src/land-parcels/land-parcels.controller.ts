import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ParcelsService } from './land-parcels.service.js';
import { CreateParcelDto } from './dto/create-parcel.dto.js';

@Controller('parcels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Get()
  list(@Query('projectId') projectId: string) {
    return this.parcelsService.findAllForProject(projectId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.parcelsService.findOne(id);
  }

  @Get(':id/geometry')
  geometry(@Param('id') id: string) {
    return this.parcelsService.getGeoJson(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER, Role.FIELD_OFFICER)
  create(@Body() dto: CreateParcelDto) {
    return this.parcelsService.create(dto);
  }
}
