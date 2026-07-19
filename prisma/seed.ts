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

  // Create daily challenges if they don't exist
  const existingClassic = await prisma.dailyChallenge.findFirst({ where: { mode: 'CLASSIC' } });
  if (!existingClassic) {
    console.log('Creating initial CLASSIC daily challenge...');
    const randomChamp = await prisma.champion.findFirst();
    if (randomChamp) {
      await prisma.dailyChallenge.create({
        data: {
          mode: 'CLASSIC',
          championsId: randomChamp.id,
        }
      });
      console.log('CLASSIC daily challenge created!');
    }
  }

  // Create JIGSAW challenge
  console.log('Cleaning up existing JIGSAW challenge...');
  await prisma.dailyChallenge.deleteMany({ where: { mode: 'JIGSAW' } });
  
  console.log('Creating initial JIGSAW daily challenge...');
  // get all champions to pick a random one
  const allChamps = await prisma.champion.findMany();
  if (allChamps.length > 0) {
    const randomChamp = allChamps[Math.floor(Math.random() * allChamps.length)];
    // select a random splash art
    if (randomChamp.splashPath.length > 0) {
      const randomSplash = randomChamp.splashPath[Math.floor(Math.random() * randomChamp.splashPath.length)];
      await prisma.dailyChallenge.create({
        data: {
          mode: 'JIGSAW',
          championsId: randomChamp.id,
          imagePath: randomSplash,
        }
      });
      console.log('JIGSAW daily challenge created!');
    } else {
      console.log('No valid splash paths found for ' + randomChamp.name);
    }
  }
  // Create TRAITS challenge
  console.log('Cleaning up existing TRAITS challenge...');
  await prisma.dailyChallenge.deleteMany({ where: { mode: 'TRAITS' } });
  
  console.log('Creating initial TRAITS daily challenge...');
  if (allChamps.length > 0) {
    const randomChamp = allChamps[Math.floor(Math.random() * allChamps.length)];
    await prisma.dailyChallenge.create({
      data: {
        mode: 'TRAITS',
        championsId: randomChamp.id,
      }
    });
    console.log('TRAITS daily challenge created!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
