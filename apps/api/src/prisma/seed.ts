import 'dotenv/config';

import { PrismaClient, Role } from '../generated/prisma/client.js';
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
  // =====================================================
  // 1. Organization
  // =====================================================

  const organization = await prisma.organization.upsert({
    where: {
      code: 'GOVT-MP',
    },

    update: {},

    create: {
      name: 'Government of Madhya Pradesh',
      code: 'GOVT-MP',
    },
  });

  // =====================================================
  // 2. Madhya Pradesh
  // =====================================================

  const mp = await prisma.state.upsert({
    where: {
      code: 'MP',
    },

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

  const tehsils = [
    {
      name: 'Jabalpur',
      code: 'JBP-01',
    },
    {
      name: 'Kundam',
      code: 'JBP-02',
    },
    {
      name: 'Majholi',
      code: 'JBP-03',
    },
    {
      name: 'Panagar',
      code: 'JBP-04',
    },
    {
      name: 'Patan',
      code: 'JBP-05',
    },
    {
      name: 'Shahpura',
      code: 'JBP-06',
    },
  ];

  for (const tehsil of tehsils) {
    await prisma.tehsil.upsert({
      where: {
        districtId_code: {
          districtId: jabalpur.id,
          code: tehsil.code,
        },
      },

      update: {
        name: tehsil.name,
      },

      create: {
        name: tehsil.name,
        code: tehsil.code,
        districtId: jabalpur.id,
      },
    });
  }

  // =====================================================
  // 5. Create ADMIN account
  // =====================================================

  const adminPasswordHash = await argon2.hash(
    'Admin@12345',
  );

  const admin = await prisma.user.upsert({
    where: {
      aadharId: '999999999999',
    },

    update: {},

    create: {
      name: 'System Administrator',
      aadharId: '999999999999',
      mobileNo: '9999999999',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Admin ready: ${admin.name}`);

  // =====================================================
  // 6. Create STATE OFFICER
  // =====================================================

  const stateOfficerPasswordHash = await argon2.hash(
    'State@12345',
  );

  const stateOfficer = await prisma.user.upsert({
    where: {
      aadharId: '222222222222',
    },

    update: {},

    create: {
      name: 'Madhya Pradesh State Officer',
      aadharId: '222222222222',
      mobileNo: '9222222222',
      passwordHash: stateOfficerPasswordHash,

      role: Role.STATE_OFFICER,

      organizationId: organization.id,
      stateId: mp.id,

      isActive: true,
    },
  });

  console.log(
    `✅ State Officer ready: ${stateOfficer.name}`,
  );

  // =====================================================
  // 7. Create DISTRICT OFFICER
  // =====================================================

  const districtOfficerPasswordHash =
    await argon2.hash('District@12345');

  const districtOfficer = await prisma.user.upsert({
    where: {
      aadharId: '333333333333',
    },

    update: {},

    create: {
      name: 'Jabalpur District Officer',
      aadharId: '333333333333',
      mobileNo: '9333333333',
      passwordHash: districtOfficerPasswordHash,

      role: Role.DISTRICT_OFFICER,

      organizationId: organization.id,
      stateId: mp.id,
      districtId: jabalpur.id,

      isActive: true,
    },
  });

  console.log(
    `✅ District Officer ready: ${districtOfficer.name}`,
  );

  // =====================================================
  // 8. Get Jabalpur Tehsil
  // =====================================================

  const jabalpurTehsil = await prisma.tehsil.findUnique({
    where: {
      districtId_code: {
        districtId: jabalpur.id,
        code: 'JBP-01',
      },
    },
  });

  if (!jabalpurTehsil) {
    throw new Error('Jabalpur tehsil not found');
  }

  // =====================================================
  // 9. Create FIELD OFFICER
  // =====================================================

  const fieldOfficerPasswordHash = await argon2.hash(
    'Field@12345',
  );

  const fieldOfficer = await prisma.user.upsert({
    where: {
      aadharId: '444444444444',
    },

    update: {},

    create: {
      name: 'Jabalpur Field Officer',
      aadharId: '444444444444',
      mobileNo: '9444444444',
      passwordHash: fieldOfficerPasswordHash,

      role: Role.FIELD_OFFICER,

      organizationId: organization.id,
      stateId: mp.id,
      districtId: jabalpur.id,
      tehsilId: jabalpurTehsil.id,

      isActive: true,
    },
  });

  console.log(
    `✅ Field Officer ready: ${fieldOfficer.name}`,
  );

  // =====================================================
  // Summary
  // =====================================================

  console.log('');
  console.log('========================================');
  console.log('✅ SEED COMPLETED');
  console.log('========================================');
  console.log(`Organization: ${organization.name}`);
  console.log(`State: ${mp.name}`);
  console.log(`District: ${jabalpur.name}`);
  console.log(`Tehsils: ${tehsils.length}`);
  console.log('');
  console.log('Authority accounts:');
  console.log('');
  console.log('ADMIN');
  console.log('  Aadhaar: 999999999999');
  console.log('  Password: Admin@12345');
  console.log('');
  console.log('STATE OFFICER');
  console.log('  Aadhaar: 222222222222');
  console.log('  Password: State@12345');
  console.log('');
  console.log('DISTRICT OFFICER');
  console.log('  Aadhaar: 333333333333');
  console.log('  Password: District@12345');
  console.log('');
  console.log('FIELD OFFICER');
  console.log('  Aadhaar: 444444444444');
  console.log('  Password: Field@12345');
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