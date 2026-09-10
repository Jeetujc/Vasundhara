import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '../generated/prisma/client.js';

interface AuthUser {
  id: string;
  role: Role;
  stateId?: string;
  districtId?: string;
  mobileNo?: string;
}

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(
    Role.ADMIN,
    Role.CENTRAL_OFFICER,
    Role.STATE_OFFICER,
    Role.DISTRICT_OFFICER,
    Role.FIELD_OFFICER,
  )
  create(@Body() dto: CreateDocumentDto, @CurrentUser() user: AuthUser) {
    return this.documentsService.create(dto, user.id);
  }

  @Get('mine')
  listMine(@CurrentUser() user: AuthUser) {
    return this.documentsService.listMine(user);
  }

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query('projectId') projectId?: string,
    @Query('parcelId') parcelId?: string,
  ) {
    return this.documentsService.list(user, projectId, parcelId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.documentsService.getById(id);
  }
}
