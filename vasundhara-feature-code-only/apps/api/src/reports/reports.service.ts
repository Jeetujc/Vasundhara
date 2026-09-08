import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateProjectReportPdf(projectId: string): Promise<Buffer> {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const [parcels, families, compensationCases, possessionRecords, rrCases, workflow] =
      await Promise.all([
        this.prisma.landParcel.findMany({ where: { projectId } }),
        this.prisma.affectedFamily.findMany({ where: { projectId } }),
        this.prisma.compensationCase.findMany({ where: { projectId } }),
        this.prisma.possessionRecord.findMany({ where: { projectId } }),
        this.prisma.rrCase.findMany({ where: { projectId } }),
        this.prisma.workflowInstance.findFirst({ where: { projectId } }),
      ]);

    return this.renderPdf({
      project,
      parcels,
      families,
      compensationCases,
      possessionRecords,
      rrCases,
      workflow,
    });
  }

  private renderPdf(data: {
    project: { name: string; code: string; status: string; description: string | null };
    parcels: Array<{ parcelNumber: string; village: string | null; status: string; area: unknown }>;
    families: unknown[];
    compensationCases: Array<{ assessedAmount: unknown; paidAmount: unknown }>;
    possessionRecords: Array<{ parcelId: string; status: string; recordedAt: Date | null }>;
    rrCases: Array<{ familyId: string; status: string }>;
    workflow: { currentStage: string } | null;
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const {
        project,
        parcels,
        families,
        compensationCases,
        possessionRecords,
        rrCases,
        workflow,
      } = data;

      doc.fontSize(20).text('VASUNDHARA - Project Report', { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text(`Project: ${project.name} (${project.code})`);
      doc.fontSize(10).fillColor('gray').text(`Status: ${project.status}`);
      doc.fillColor('black').moveDown();

      if (project.description) {
        doc.fontSize(11).text(project.description);
        doc.moveDown();
      }

      doc.fontSize(13).text('Summary', { underline: true });
      doc.fontSize(11).text(`Land Parcels: ${parcels.length}`);
      doc.text(`Affected Families: ${families.length}`);
      doc.text(`Compensation Cases: ${compensationCases.length}`);
      doc.text(`Possession Records: ${possessionRecords.length}`);
      doc.text(`R&R Cases: ${rrCases.length}`);
      doc.text(`Workflow Stage: ${workflow ? workflow.currentStage : 'Not started'}`);
      doc.moveDown();

      const totalAssessed = compensationCases.reduce((sum, c) => sum + Number(c.assessedAmount), 0);
      const totalPaid = compensationCases.reduce((sum, c) => sum + Number(c.paidAmount), 0);

      doc.fontSize(13).text('Compensation', { underline: true });
      doc.fontSize(11).text(`Total Assessed: Rs. ${totalAssessed.toLocaleString('en-IN')}`);
      doc.text(`Total Paid: Rs. ${totalPaid.toLocaleString('en-IN')}`);
      doc.moveDown();

      doc.fontSize(13).text('Land Parcels', { underline: true });
      if (parcels.length === 0) {
        doc.fontSize(11).text('No parcels recorded yet.');
      } else {
        parcels.forEach((parcel) => {
          doc
            .fontSize(11)
            .text(
              `- ${parcel.parcelNumber} | ${parcel.village ?? 'N/A'} | Status: ${parcel.status} | Area: ${parcel.area ?? 'N/A'}`,
            );
        });
      }
      doc.moveDown();

      doc.fontSize(13).text('Possession Status', { underline: true });
      if (possessionRecords.length === 0) {
        doc.fontSize(11).text('No possession records yet.');
      } else {
        possessionRecords.forEach((record) => {
          doc
            .fontSize(11)
            .text(
              `- Parcel ${record.parcelId} | Status: ${record.status} | Recorded: ${record.recordedAt ? record.recordedAt.toDateString() : 'N/A'}`,
            );
        });
      }
      doc.moveDown();

      doc.fontSize(13).text('R&R Cases', { underline: true });
      if (rrCases.length === 0) {
        doc.fontSize(11).text('No R&R cases yet.');
      } else {
        rrCases.forEach((rr) => {
          doc.fontSize(11).text(`- Family ${rr.familyId} | Status: ${rr.status}`);
        });
      }

      doc
        .fontSize(8)
        .fillColor('gray')
        .text(`Generated on ${new Date().toLocaleString()}`, { align: 'right' });

      doc.end();
    });
  }
}
