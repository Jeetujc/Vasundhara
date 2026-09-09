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
import { CreateParcelDto } from './dto/create-parcel.dto.js';
import { ListParcelsQueryDto } from './dto/list-parcels-query.dto.js';
import { UpdateParcelDto } from './dto/update-parcel.dto.js';
import { ParcelsService } from './land-parcels.service.js';

@Controller('parcels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Get()
  list(@Query() query: ListParcelsQueryDto) {
    return this.parcelsService.list(query);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.parcelsService.get(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  create(@Body() dto: CreateParcelDto) {
    return this.parcelsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  patch(@Param('id') id: string, @Body() dto: UpdateParcelDto) {
    return this.parcelsService.update(id, dto);
  }
}
