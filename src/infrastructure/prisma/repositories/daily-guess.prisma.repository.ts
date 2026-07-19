// src/infrastructure/prisma/repositories/daily-guess.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateDailyGuessInput,
  IDailyGuessRepository,
  UpdateDailyGuessInput,
} from '../../../core/daily-guess/repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from '../../../core/daily-guess/entities/daily-guess.entity';
import { DailyGuess as PrismaDailyGuess } from '../../../generated/prisma/client';

@Injectable()
export class DailyGuessPrismaRepository implements IDailyGuessRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Mapping ─────────────────────────────────────────────────

  private toEntity(prismaDailyGuess: PrismaDailyGuess): DailyGuessEntity {
    return new DailyGuessEntity({
      id: prismaDailyGuess.id,
      guessCount: prismaDailyGuess.guessCount,
      championsId: prismaDailyGuess.championsId,
      dailyChallengeId: prismaDailyGuess.dailyChallengeId,
    });
  }

  // ── CRUD ────────────────────────────────────────────────────

  async create(data: CreateDailyGuessInput): Promise<DailyGuessEntity> {
    const dailyGuess = await this.prisma.client.dailyGuess.create({ data });
    return this.toEntity(dailyGuess);
  }

  async findAll(): Promise<DailyGuessEntity[]> {
    const dailyGuesses = await this.prisma.client.dailyGuess.findMany({
      orderBy: { id: 'desc' },
    });
    return dailyGuesses.map((g) => this.toEntity(g));
  }

  async findById(id: number): Promise<DailyGuessEntity | null> {
    const dailyGuess = await this.prisma.client.dailyGuess.findUnique({ where: { id } });
    return dailyGuess ? this.toEntity(dailyGuess) : null;
  }

  async update(id: number, data: UpdateDailyGuessInput): Promise<DailyGuessEntity> {
    const dailyGuess = await this.prisma.client.dailyGuess.update({ where: { id }, data });
    return this.toEntity(dailyGuess);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.client.dailyGuess.delete({ where: { id } });
  }

  async deleteAll(): Promise<number> {
    const result = await this.prisma.client.dailyGuess.deleteMany();
    return result.count;
  }

  async resetAllGuessCounts(): Promise<number> {
    const result = await this.prisma.client.dailyGuess.updateMany({
      data: {
        guessCount: 0,
      },
    });
    return result.count;
  }
}
