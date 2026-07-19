import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public readonly client: PrismaClient;

  constructor() {
    const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
    const pool = new Pool({
      connectionString: dbUrl,
      // ── Serverless-friendly pool settings ─────────────────────
      // Supabase Pooler (PgBouncer) manages the real pool on its side,
      // so each Lambda instance only needs 1–2 connections at most.
      max: 2,
      // Release connections immediately when idle so that Lambda
      // function instances do not hold open connections between invocations.
      idleTimeoutMillis: 0,
      // Fail fast if the pooler is unreachable (cold start timeout guard).
      connectionTimeoutMillis: 5000,
    });
    const adapter = new PrismaPg(pool);
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
    this.logger.log('Prisma connected to database');
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
    this.logger.log('Prisma disconnected from database');
  }
}
