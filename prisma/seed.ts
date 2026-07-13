import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, Gender, ChampionRole, DamageType, Resource, RangeType } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const dataPath = path.join(__dirname, 'champions-data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const champions = JSON.parse(rawData);

  console.log(`Start seeding ${champions.length} champions...`);

  for (const champ of champions) {
    await prisma.champion.upsert({
      where: { name: champ.name },
      update: {
        gender: champ.gender as Gender,
        role: champ.role as ChampionRole,
        damageType: champ.damageType as DamageType,
        resource: champ.resource as Resource,
        rangeType: champ.rangeType as RangeType,
        yearRelease: champ.yearRelease,
        traits: champ.traits,
        iconPath: champ.iconPath,
        splashPath: champ.splashPath,
        hint: champ.hint,
      },
      create: {
        name: champ.name,
        gender: champ.gender as Gender,
        role: champ.role as ChampionRole,
        damageType: champ.damageType as DamageType,
        resource: champ.resource as Resource,
        rangeType: champ.rangeType as RangeType,
        yearRelease: champ.yearRelease,
        traits: champ.traits,
        iconPath: champ.iconPath,
        splashPath: champ.splashPath,
        hint: champ.hint,
      },
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
