// src/infrastructure/prisma/repositories/daily-challenge.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateDailyChallengeInput,
  IDailyChallengeRepository,
  UpdateDailyChallengeInput,
} from '../../../core/daily-challenge/repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity, Mode } from '../../../core/daily-challenge/entities/daily-challenge.entity';
import { DailyChallenge as PrismaDailyChallenge } from '../../../generated/prisma/client';

@Injectable()
export class DailyChallengePrismaRepository implements IDailyChallengeRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Mapping ─────────────────────────────────────────────────

  private toEntity(prismaDailyChallenge: PrismaDailyChallenge): DailyChallengeEntity {
    return new DailyChallengeEntity({
      id: prismaDailyChallenge.id,
      mode: prismaDailyChallenge.mode as Mode,
      championsId: prismaDailyChallenge.championsId ?? undefined,
      imagePath: prismaDailyChallenge.imagePath ?? undefined,
      matcherChampions: prismaDailyChallenge.matcherChampions,
    });
  }

  // ── CRUD ────────────────────────────────────────────────────

  async create(data: CreateDailyChallengeInput): Promise<DailyChallengeEntity> {
    const dailyChallenge = await this.prisma.client.dailyChallenge.create({ data });
    return this.toEntity(dailyChallenge);
  }

  async findAll(): Promise<DailyChallengeEntity[]> {
    const dailyChallenges = await this.prisma.client.dailyChallenge.findMany({
      orderBy: { id: 'desc' },
    });
    return dailyChallenges.map((c) => this.toEntity(c));
  }

  async findById(id: number): Promise<DailyChallengeEntity | null> {
    const dailyChallenge = await this.prisma.client.dailyChallenge.findUnique({ where: { id } });
    return dailyChallenge ? this.toEntity(dailyChallenge) : null;
  }

  async update(id: number, data: UpdateDailyChallengeInput): Promise<DailyChallengeEntity> {
    const dailyChallenge = await this.prisma.client.dailyChallenge.update({ where: { id }, data });
    return this.toEntity(dailyChallenge);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.client.dailyChallenge.delete({ where: { id } });
  }

  async deleteAll(): Promise<number> {
    const result = await this.prisma.client.dailyChallenge.deleteMany();
    return result.count;
  }
}
