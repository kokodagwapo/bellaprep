import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a super admin tenant
  const superTenant = await prisma.tenant.create({
    data: {
      name: 'BellaPrep Platform',
      subdomain: 'platform',
      brandColors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#10b981',
      },
    },
  });

  // Create super admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      tenantId: superTenant.id,
      email: 'admin@bellaprep.com',
      passwordHash: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      mfaEnabled: false,
    },
  });

  // Create default products for the tenant
  const products = [
    {
      name: 'Conventional',
      enabled: true,
      propertyTypes: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'],
      requiredFields: ['creditScore', 'downPayment', 'income'],
      conditionalLogic: {},
      checklists: [],
      underwritingRules: {},
    },
    {
      name: 'FHA',
      enabled: true,
      propertyTypes: ['Single Family', 'Condo', 'Townhouse'],
      requiredFields: ['creditScore', 'downPayment', 'income'],
      conditionalLogic: {},
      checklists: [],
      underwritingRules: {},
    },
    {
      name: 'VA',
      enabled: true,
      propertyTypes: ['Single Family', 'Condo', 'Townhouse'],
      requiredFields: ['militaryStatus', 'income'],
      conditionalLogic: {},
      checklists: [],
      underwritingRules: {},
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        tenantId: superTenant.id,
        ...product,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

