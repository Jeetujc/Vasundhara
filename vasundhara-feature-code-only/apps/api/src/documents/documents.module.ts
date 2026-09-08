import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller.js';
import { DocumentsService } from './documents.service.js';
import { STORAGE_ADAPTER } from './storage/storage-adapter.interface.js';
import { LocalDiskStorageAdapter } from './storage/local-disk-storage.adapter.js';

@Module({
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    { provide: STORAGE_ADAPTER, useClass: LocalDiskStorageAdapter },
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
