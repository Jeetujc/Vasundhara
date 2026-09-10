import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // 1. Organization
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

  // 2. Madhya Pradesh
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

  // 3. Jabalpur District
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

  // 4. Jabalpur Tehsils
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

  console.log('✅ Prototype location data seeded successfully');
  console.log(`State: ${mp.name}`);
  console.log(`District: ${jabalpur.name}`);
  console.log(`Tehsils: ${tehsils.length}`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });