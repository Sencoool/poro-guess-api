import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.dailyChallenge.deleteMany({ where: { mode: 'JIGSAW' } });
  console.log('Deleted Jigsaw');
}
main().catch(console.error).finally(() => prisma.$disconnect());
