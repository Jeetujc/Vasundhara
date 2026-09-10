import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { AuditService } from '../audit/audit.service.js';
import { Role } from '../generated/prisma/client.js';

interface UserContext {
  id: string;
  role: Role;
  stateId?: string;
  districtId?: string;
  mobileNo?: string;
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  private mapDocument(doc: any) {
    return {
      ...doc,
      sizeBytes: doc.sizeBytes ? Number(doc.sizeBytes) : null,
    };
  }

  async create(dto: CreateDocumentDto, userId: string) {
    const document = await this.prisma.document.create({
      data: {
        name: dto.name,
        storageKey: dto.storageKey,
        mimeType: dto.mimeType ?? 'application/pdf',
        sizeBytes: dto.sizeBytes ? BigInt(dto.sizeBytes) : null,
        projectId: dto.projectId,
        parcelId: dto.parcelId,
        familyId: dto.familyId,
        compensationId: dto.compensationId,
        uploadedById: userId,
      },
      include: {
        project: { select: { id: true, name: true, code: true } },
      },
    });

    await this.auditService.create({
      action: 'DOCUMENT_UPLOADED',
      entityType: 'Document',
      entityId: document.id,
      userId,
      projectId: dto.projectId,
      description: `Document '${dto.name}' registered.`,
    });

    return this.mapDocument(document);
  }

  async list(user: UserContext, projectId?: string, parcelId?: string) {
    const where: any = {
      ...(projectId ? { projectId } : {}),
      ...(parcelId ? { parcelId } : {}),
    };

    if (user.role === Role.STATE_OFFICER && user.stateId) {
      where.project = { stateId: user.stateId };
    } else if (user.role === Role.DISTRICT_OFFICER && user.districtId) {
      where.project = { districtId: user.districtId };
    }

    const docs = await this.prisma.document.findMany({
      where,
      include: {
        project: { select: { id: true, name: true, code: true } },
        parcel: { select: { id: true, parcelNumber: true } },
        uploadedBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return docs.map((d) => this.mapDocument(d));
  }

  async listMine(user: UserContext) {
    // Find family linked to citizen's contact number
    let familyId: string | undefined;
    if (user.mobileNo) {
      const family = await this.prisma.affectedFamily.findFirst({
        where: { contactNumber: user.mobileNo },
        select: { id: true, projectId: true },
      });
      familyId = family?.id;
    }

    const docs = await this.prisma.document.findMany({
      where: {
        OR: [
          { uploadedById: user.id },
          ...(familyId ? [{ familyId }] : []),
        ],
      },
      include: {
        project: { select: { id: true, name: true } },
        parcel: { select: { id: true, parcelNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return docs.map((d) => this.mapDocument(d));
  }

  async getById(id: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: {
        project: true,
        parcel: true,
        uploadedBy: { select: { id: true, name: true, role: true } },
      },
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    return this.mapDocument(doc);
  }
}
