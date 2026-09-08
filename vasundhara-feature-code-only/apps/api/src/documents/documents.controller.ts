import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import { DocumentsService } from './documents.service.js';
import type { UploadDocumentInput } from './documents.service.js';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  list(@Query('projectId') projectId: string) {
    return this.documentsService.findAllForProject(projectId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDocumentInput,
    @CurrentUser() user: RequestUser,
  ) {
    return this.documentsService.upload(file, body, user);
  }
}
