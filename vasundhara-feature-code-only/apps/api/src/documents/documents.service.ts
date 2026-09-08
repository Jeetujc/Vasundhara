import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { STORAGE_ADAPTER, type StorageAdapter } from './storage/storage-adapter.interface.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';

export interface UploadDocumentInput {
  projectId?: string;
  parcelId?: string;
  familyId?: string;
  compensationId?: string;
  possessionId?: string;
  rrCaseId?: string;
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    @Inject(STORAGE_ADAPTER) private readonly storage: StorageAdapter,
  ) {}

  async upload(file: Express.Multer.File, input: UploadDocumentInput, user: RequestUser) {
    const key = `${randomUUID()}-${file.originalname}`;
    await this.storage.save(file.buffer, key, file.mimetype);

    const document = await this.prisma.document.create({
      data: {
        projectId: input.projectId,
        parcelId: input.parcelId,
        familyId: input.familyId,
        compensationId: input.compensationId,
        possessionId: input.possessionId,
        rrCaseId: input.rrCaseId,
        uploadedById: user.userId,
        name: file.originalname,
        storageKey: key,
        mimeType: file.mimetype,
        sizeBytes: BigInt(file.size),
      },
    });

    await this.audit.log({
      userId: user.userId,
      action: 'DOCUMENT_UPLOADED',
      entityType: 'Document',
      entityId: document.id,
      projectId: input.projectId,
      parcelId: input.parcelId,
      familyId: input.familyId,
      compensationId: input.compensationId,
      possessionId: input.possessionId,
      rrCaseId: input.rrCaseId,
    });

    return document;
  }

  findAllForProject(projectId: string) {
    return this.prisma.document.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }
}
