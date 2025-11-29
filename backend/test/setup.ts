import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean database before tests
  await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE');
  await prisma.$executeRawUnsafe('CREATE SCHEMA public');
  
  // Run migrations
  const { execSync } = require('child_process');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
});

afterAll(async () => {
  await prisma.$disconnect();
});

