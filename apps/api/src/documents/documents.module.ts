import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DocumentsController } from './documents.controller.js';
import { DocumentsService } from './documents.service.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), AuditModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
