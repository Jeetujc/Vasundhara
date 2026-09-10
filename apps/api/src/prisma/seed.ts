import 'dotenv/config';

import {
  PrismaClient,
  Role,
  ProjectStatus,
  ParcelStatus,
  WorkflowStatus,
  WorkflowTaskStatus,
  CompensationStatus,
  PaymentStatus,
  PossessionStatus,
  RrStatus,
  DocumentStatus,
  NotificationStatus,
  GrievanceStatus,
} from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Seeding VASUNDHARA database...');

  // =====================================================
  // 1. Organization
  // =====================================================
  const organization = await prisma.organization.upsert({
    where: { code: 'GOVT-MP' },
    update: {},
    create: {
      name: 'Government of Madhya Pradesh',
      code: 'GOVT-MP',
    },
  });

  // =====================================================
  // 2. Madhya Pradesh State
  // =====================================================
  const mp = await prisma.state.upsert({
    where: { code: 'MP' },
    update: {},
    create: {
      name: 'Madhya Pradesh',
      code: 'MP',
      organizationId: organization.id,
    },
  });

  // =====================================================
  // 3. Jabalpur District
  // =====================================================
  const jabalpur = await prisma.district.upsert({
    where: {
      stateId_code: {
        stateId: mp.id,
        code: 'JBP',
      },
    },
    update: {},
    create: {
      name: 'Jabalpur',
      code: 'JBP',
      stateId: mp.id,
    },
  });

  // =====================================================
  // 4. Jabalpur Tehsils
  // =====================================================
  const tehsilDefs = [
    { name: 'Jabalpur', code: 'JBP-01' },
    { name: 'Kundam', code: 'JBP-02' },
    { name: 'Majholi', code: 'JBP-03' },
    { name: 'Panagar', code: 'JBP-04' },
    { name: 'Patan', code: 'JBP-05' },
    { name: 'Shahpura', code: 'JBP-06' },
  ];

  const tehsilsMap: Record<string, string> = {};

  for (const t of tehsilDefs) {
    const record = await prisma.tehsil.upsert({
      where: {
        districtId_code: {
          districtId: jabalpur.id,
          code: t.code,
        },
      },
      update: { name: t.name },
      create: {
        name: t.name,
        code: t.code,
        districtId: jabalpur.id,
      },
    });
    tehsilsMap[t.name] = record.id;
  }

  // =====================================================
  // 5. Authority Users & Prototype Citizen
  // =====================================================
  const adminPassword = await argon2.hash('Admin@12345');
  const admin = await prisma.user.upsert({
    where: { aadharId: '999999999999' },
    update: {},
    create: {
      name: 'System Administrator',
      aadharId: '999999999999',
      mobileNo: '9999999999',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const centralPassword = await argon2.hash('Central@12345');
  const centralOfficer = await prisma.user.upsert({
    where: { aadharId: '111111111111' },
    update: {},
    create: {
      name: 'National Land Commissioner',
      aadharId: '111111111111',
      mobileNo: '9111111111',
      passwordHash: centralPassword,
      role: Role.CENTRAL_OFFICER,
      isActive: true,
    },
  });

  const statePassword = await argon2.hash('State@12345');
  const stateOfficer = await prisma.user.upsert({
    where: { aadharId: '222222222222' },
    update: {},
    create: {
      name: 'Madhya Pradesh State Officer',
      aadharId: '222222222222',
      mobileNo: '9222222222',
      passwordHash: statePassword,
      role: Role.STATE_OFFICER,
      organizationId: organization.id,
      stateId: mp.id,
      isActive: true,
    },
  });

  const districtPassword = await argon2.hash('District@12345');
  const districtOfficer = await prisma.user.upsert({
    where: { aadharId: '333333333333' },
    update: {},
    create: {
      name: 'Jabalpur District Officer',
      aadharId: '333333333333',
      mobileNo: '9333333333',
      passwordHash: districtPassword,
      role: Role.DISTRICT_OFFICER,
      organizationId: organization.id,
      stateId: mp.id,
      districtId: jabalpur.id,
      isActive: true,
    },
  });

  const fieldPassword = await argon2.hash('Field@12345');
  const fieldOfficer = await prisma.user.upsert({
    where: { aadharId: '444444444444' },
    update: {},
    create: {
      name: 'Jabalpur Field Officer',
      aadharId: '444444444444',
      mobileNo: '9444444444',
      passwordHash: fieldPassword,
      role: Role.FIELD_OFFICER,
      organizationId: organization.id,
      stateId: mp.id,
      districtId: jabalpur.id,
      tehsilId: tehsilsMap['Panagar'] || tehsilsMap['Jabalpur'],
      isActive: true,
    },
  });

  const citizenPassword = await argon2.hash('Citizen@12345');
  const citizen = await prisma.user.upsert({
    where: { aadharId: '555555555555' },
    update: {},
    create: {
      name: 'Ramesh Patel',
      aadharId: '555555555555',
      mobileNo: '9555555555',
      dob: new Date('1982-06-15'),
      passwordHash: citizenPassword,
      role: Role.PUBLIC_USER,
      organizationId: organization.id,
      stateId: mp.id,
      districtId: jabalpur.id,
      tehsilId: tehsilsMap['Panagar'],
      isActive: true,
    },
  });

  console.log('✅ Authority & Citizen accounts provisioned');

  // =====================================================
  // 6. Prototype Projects
  // =====================================================
  const project1 = await prisma.project.upsert({
    where: { code: 'NH44-JBP' },
    update: {},
    create: {
      name: 'NH-44 Highway Widening (Jabalpur Stretch)',
      code: 'NH44-JBP',
      description: 'Widening of NH-44 corridor to 6-lane standard through Jabalpur district, connecting industrial growth centers.',
      status: ProjectStatus.ACQUISITION_IN_PROGRESS,
      stateId: mp.id,
      districtId: jabalpur.id,
      proposedArea: 420.50,
      proposalDate: new Date('2025-08-10'),
      approvalDate: new Date('2025-11-20'),
    },
  });

  const project2 = await prisma.project.upsert({
    where: { code: 'DFC-MP-01' },
    update: {},
    create: {
      name: 'Dedicated Freight Corridor (East-West)',
      code: 'DFC-MP-01',
      description: 'High-speed dedicated freight rail link intersecting central Madhya Pradesh.',
      status: ProjectStatus.NOTIFIED,
      stateId: mp.id,
      districtId: jabalpur.id,
      proposedArea: 650.00,
      proposalDate: new Date('2025-10-01'),
      approvalDate: new Date('2026-01-15'),
    },
  });

  const project3 = await prisma.project.upsert({
    where: { code: 'NVCN-MP-03' },
    update: {},
    create: {
      name: 'Narmada Valley Canal Network Phase 3',
      code: 'NVCN-MP-03',
      description: 'Irrigation feeder canal expanding agricultural coverage to eastern tehsils.',
      status: ProjectStatus.AWARD_DECLARED,
      stateId: mp.id,
      districtId: jabalpur.id,
      proposedArea: 850.00,
      proposalDate: new Date('2025-05-12'),
      approvalDate: new Date('2025-09-18'),
    },
  });

  console.log('✅ Projects created');

  // =====================================================
  // 7. Land Parcels
  // =====================================================
  const parcel1 = await prisma.landParcel.upsert({
    where: {
      projectId_parcelNumber: {
        projectId: project1.id,
        parcelNumber: '452/1',
      },
    },
    update: {},
    create: {
      projectId: project1.id,
      parcelNumber: '452/1',
      surveyNumber: 'SV-452-A',
      village: 'Rau / Panagar',
      tehsil: 'Panagar',
      area: 2.4500,
      status: ParcelStatus.AWARD_DECLARED,
    },
  });

  const parcel2 = await prisma.landParcel.upsert({
    where: {
      projectId_parcelNumber: {
        projectId: project1.id,
        parcelNumber: '453',
      },
    },
    update: {},
    create: {
      projectId: project1.id,
      parcelNumber: '453',
      surveyNumber: 'SV-453',
      village: 'Rau / Panagar',
      tehsil: 'Panagar',
      area: 1.8000,
      status: ParcelStatus.NOTIFIED,
    },
  });

  const parcel3 = await prisma.landParcel.upsert({
    where: {
      projectId_parcelNumber: {
        projectId: project2.id,
        parcelNumber: '108/2',
      },
    },
    update: {},
    create: {
      projectId: project2.id,
      parcelNumber: '108/2',
      surveyNumber: 'SV-108-B',
      village: 'Kundam',
      tehsil: 'Kundam',
      area: 3.2000,
      status: ParcelStatus.PROPOSED,
    },
  });

  const parcel4 = await prisma.landParcel.upsert({
    where: {
      projectId_parcelNumber: {
        projectId: project3.id,
        parcelNumber: '89/1',
      },
    },
    update: {},
    create: {
      projectId: project3.id,
      parcelNumber: '89/1',
      surveyNumber: 'SV-89-A',
      village: 'Majholi',
      tehsil: 'Majholi',
      area: 1.9500,
      status: ParcelStatus.AWARD_DECLARED,
    },
  });

  const parcel5 = await prisma.landParcel.upsert({
    where: {
      projectId_parcelNumber: {
        projectId: project3.id,
        parcelNumber: '89/2',
      },
    },
    update: {},
    create: {
      projectId: project3.id,
      parcelNumber: '89/2',
      surveyNumber: 'SV-89-B',
      village: 'Majholi',
      tehsil: 'Majholi',
      area: 2.1000,
      status: ParcelStatus.ACQUIRED,
    },
  });

  // =====================================================
  // 8. Affected Families & Linking
  // =====================================================
  const family = await prisma.affectedFamily.upsert({
    where: { familyReference: 'FAM-JBP-001' },
    update: {},
    create: {
      projectId: project1.id,
      familyReference: 'FAM-JBP-001',
      headOfFamily: 'Ramesh Patel',
      contactNumber: '9555555555',
      address: 'Village Rau / Panagar, Tehsil Panagar, District Jabalpur',
      numberOfMembers: 5,
      displaced: true,
    },
  });

  await prisma.familyParcel.upsert({
    where: {
      familyId_parcelId: {
        familyId: family.id,
        parcelId: parcel1.id,
      },
    },
    update: {},
    create: {
      familyId: family.id,
      parcelId: parcel1.id,
      affectedArea: 2.4500,
    },
  });

  const extraPafs = [
    { ref: 'FAM-JBP-002', name: 'Suresh Verma', phone: '9555555556' },
    { ref: 'FAM-JBP-003', name: 'Anil Kumar Yadav', phone: '9555555557' },
    { ref: 'FAM-JBP-004', name: 'Mahesh Sharma', phone: '9555555558' },
  ];

  for (const p of extraPafs) {
    await prisma.affectedFamily.upsert({
      where: { familyReference: p.ref },
      update: {},
      create: {
        projectId: project1.id,
        familyReference: p.ref,
        headOfFamily: p.name,
        contactNumber: p.phone,
        address: 'Village Panagar, Jabalpur',
        numberOfMembers: 4,
        displaced: true,
      },
    });
  }

  // =====================================================
  // 9. Compensation Case
  // =====================================================
  const existingCase = await prisma.compensationCase.findFirst({
    where: {
      projectId: project1.id,
      parcelId: parcel1.id,
      familyId: family.id,
    },
  });

  if (!existingCase) {
    await prisma.compensationCase.create({
      data: {
        projectId: project1.id,
        parcelId: parcel1.id,
        familyId: family.id,
        assessedAmount: 8050000.00,
        approvedAmount: 8050000.00,
        paidAmount: 0.00,
        pendingAmount: 8050000.00,
        status: CompensationStatus.APPROVED,
        paymentStatus: PaymentStatus.PENDING,
        awardDate: new Date('2026-03-01'),
      },
    });
  }

  // =====================================================
  // 10. R&R Case
  // =====================================================
  const existingRr = await prisma.rrCase.findFirst({
    where: {
      projectId: project1.id,
      familyId: family.id,
    },
  });

  if (!existingRr) {
    await prisma.rrCase.create({
      data: {
        projectId: project1.id,
        familyId: family.id,
        status: RrStatus.IN_PROGRESS,
        housingSupport: true,
        financialAssistance: true,
        employmentSupport: false,
        relocationSupport: true,
        benefitsDescription: 'Housing plot allocated at Sector 4, Plot No. 12 + One-time Displacement Allowance of ₹50,000.',
        assessedAt: new Date('2026-02-15'),
      },
    });
  }

  // =====================================================
  // 11. Possession Record
  // =====================================================
  const existingPossession = await prisma.possessionRecord.findFirst({
    where: {
      projectId: project1.id,
      parcelId: parcel1.id,
    },
  });

  if (!existingPossession) {
    await prisma.possessionRecord.create({
      data: {
        projectId: project1.id,
        parcelId: parcel1.id,
        fieldOfficerId: fieldOfficer.id,
        status: PossessionStatus.ELIGIBLE,
        latitude: 23.1815,
        longitude: 79.9864,
        remarks: 'Preliminary peg-marking and boundary walkover completed. Ready for joint panchnama upon compensation disbursal.',
      },
    });

    await prisma.possessionRecord.create({
      data: {
        projectId: project1.id,
        parcelId: parcel2.id,
        fieldOfficerId: fieldOfficer.id,
        status: PossessionStatus.VERIFIED,
        latitude: 23.1840,
        longitude: 79.9900,
        remarks: 'GPS boundaries walked and verified. Joint panchnama executed with Patwari.',
        recordedAt: new Date('2026-08-20'),
      },
    });

    await prisma.possessionRecord.create({
      data: {
        projectId: project2.id,
        parcelId: parcel3.id,
        fieldOfficerId: fieldOfficer.id,
        status: PossessionStatus.ELIGIBLE,
        latitude: 23.2280,
        longitude: 80.2010,
        remarks: 'Freight corridor alignment peg marking completed.',
      },
    });

    await prisma.possessionRecord.create({
      data: {
        projectId: project3.id,
        parcelId: parcel4.id,
        fieldOfficerId: fieldOfficer.id,
        status: PossessionStatus.POSSESSION_RECORDED,
        latitude: 23.2845,
        longitude: 79.9120,
        remarks: 'Physical possession recorded under Section 38. Handed over to Irrigation Department.',
        recordedAt: new Date('2026-07-15'),
      },
    });

    await prisma.possessionRecord.create({
      data: {
        projectId: project3.id,
        parcelId: parcel5.id,
        fieldOfficerId: fieldOfficer.id,
        status: PossessionStatus.COMPLETED,
        latitude: 23.2870,
        longitude: 79.9160,
        remarks: 'Canal construction right-of-way cleared and fenced.',
        recordedAt: new Date('2026-06-10'),
      },
    });
  }

  // =====================================================
  // 12. Workflow Instance & Tasks
  // =====================================================
  let workflow = await prisma.workflowInstance.findFirst({
    where: { projectId: project1.id },
  });

  if (!workflow) {
    workflow = await prisma.workflowInstance.create({
      data: {
        projectId: project1.id,
        currentStage: 'AWARD_DECLARATION',
        status: WorkflowStatus.IN_PROGRESS,
        startedAt: new Date('2026-01-05'),
      },
    });

    await prisma.workflowTask.createMany({
      data: [
        {
          workflowId: workflow.id,
          stage: 'NOTIFICATION',
          title: 'Section 11 Preliminary Gazette Notification',
          assignedToId: districtOfficer.id,
          status: WorkflowTaskStatus.COMPLETED,
          completedAt: new Date('2026-01-12'),
        },
        {
          workflowId: workflow.id,
          stage: 'OBJECTIONS_CLAIMS',
          title: 'Section 15 Public Hearing & Objections Inquiry',
          assignedToId: districtOfficer.id,
          status: WorkflowTaskStatus.COMPLETED,
          completedAt: new Date('2026-03-05'),
        },
        {
          workflowId: workflow.id,
          stage: 'AWARD_DECLARATION',
          title: 'Award Declared & Bank Account Validation',
          assignedToId: districtOfficer.id,
          status: WorkflowTaskStatus.IN_PROGRESS,
          deadline: new Date('2026-09-30'),
        },
        {
          workflowId: workflow.id,
          stage: 'COMPENSATION',
          title: 'Field Verification of Land Assets & Trees (Village Rau)',
          assignedToId: fieldOfficer.id,
          status: WorkflowTaskStatus.IN_PROGRESS,
          deadline: new Date('2026-09-20'),
        },
        {
          workflowId: workflow.id,
          stage: 'POSSESSION',
          title: 'Section 38 Physical Possession & Joint Panchnama',
          assignedToId: fieldOfficer.id,
          status: WorkflowTaskStatus.PENDING,
          deadline: new Date('2026-10-15'),
        },
      ],
    });
  }

  // =====================================================
  // 13. Documents
  // =====================================================
  const docCount = await prisma.document.count({
    where: { projectId: project1.id },
  });

  if (docCount === 0) {
    await prisma.document.createMany({
      data: [
        {
          projectId: project1.id,
          name: 'Section 11 Gazette Notification (Indore-Jabalpur Corridor).pdf',
          storageKey: 'docs/gazette-sec11.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 2400000n,
          status: DocumentStatus.APPROVED,
          uploadedById: districtOfficer.id,
        },
        {
          projectId: project1.id,
          parcelId: parcel1.id,
          name: 'Khasra Map Extract 452/1 (Geo-Referenced).pdf',
          storageKey: 'docs/khasra-452-1.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 1800000n,
          status: DocumentStatus.APPROVED,
          uploadedById: fieldOfficer.id,
        },
        {
          projectId: project1.id,
          parcelId: parcel1.id,
          familyId: family.id,
          name: 'Final Award Order (Section 21) & Valuation Sheet.pdf',
          storageKey: 'docs/award-sec21.pdf',
          mimeType: 'application/pdf',
          sizeBytes: 1200000n,
          status: DocumentStatus.APPROVED,
          uploadedById: districtOfficer.id,
        },
      ],
    });
  }

  // =====================================================
  // 14. Notifications
  // =====================================================
  const notifCount = await prisma.notification.count({
    where: { userId: citizen.id },
  });

  if (notifCount === 0) {
    await prisma.notification.createMany({
      data: [
        {
          userId: citizen.id,
          title: 'Action Required: Bank Account Verification',
          message: 'Your compensation award has been declared. Please verify your Aadhaar-linked bank details to enable PFMS transfer.',
          status: NotificationStatus.SENT,
          sentAt: new Date(),
        },
        {
          userId: citizen.id,
          title: 'Section 21 Award Order Published',
          message: 'Final Award Order for Khasra 452/1 has been uploaded to your Document Vault.',
          status: NotificationStatus.SENT,
          sentAt: new Date(Date.now() - 3600000 * 24 * 2),
        },
      ],
    });
  }

  const foNotifCount = await prisma.notification.count({
    where: { userId: fieldOfficer.id },
  });

  if (foNotifCount === 0) {
    await prisma.notification.createMany({
      data: [
        {
          userId: fieldOfficer.id,
          title: 'Field Task Assigned',
          message: 'Conduct physical verification of attached assets for Khasra 452/1, Panagar.',
          status: NotificationStatus.SENT,
          sentAt: new Date(),
        },
      ],
    });
  }

  // =====================================================
  // 15. Grievances
  // =====================================================
  const grievanceCount = await prisma.grievance.count({
    where: { userId: citizen.id },
  });

  if (grievanceCount === 0) {
    await prisma.grievance.create({
      data: {
        ticketNo: 'G-10492',
        userId: citizen.id,
        projectId: project1.id,
        category: 'asset_valuation',
        khasraNo: '452/1',
        description: 'Missing 4 teak trees and irrigation borewell in initial asset calculation.',
        status: GrievanceStatus.RESOLVED,
        resolution: 'CALA conducted joint field re-verification. Valuation adjusted by ₹2,50,000 in final award order.',
        resolvedAt: new Date('2026-05-04'),
      },
    });
  }

  console.log('========================================');
  console.log('✅ SEED COMPLETED SUCCESSFULLY');
  console.log('========================================');
  console.log('Prototype Accounts:');
  console.log('  ADMIN:            999999999999 / Admin@12345');
  console.log('  CENTRAL_OFFICER:  111111111111 / Central@12345');
  console.log('  STATE_OFFICER:    222222222222 / State@12345 (MP)');
  console.log('  DISTRICT_OFFICER: 333333333333 / District@12345 (Jabalpur, MP)');
  console.log('  FIELD_OFFICER:    444444444444 / Field@12345 (Panagar, Jabalpur)');
  console.log('  PUBLIC_USER:      555555555555 / Citizen@12345 (Ramesh Patel)');
  console.log('========================================');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });