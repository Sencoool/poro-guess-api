// src/core/daily-challenge/use-cases/find-daily-challenge-by-id.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DAILY_CHALLENGE_REPOSITORY } from '../repositories/daily-challenge.repository.interface';
import type { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity } from '../entities/daily-challenge.entity';

@Injectable()
export class FindDailyChallengeByIdUseCase {
  constructor(
    @Inject(DAILY_CHALLENGE_REPOSITORY)
    private readonly dailyChallengeRepository: IDailyChallengeRepository,
  ) {}

  async execute(id: number): Promise<DailyChallengeEntity> {
    const dailyChallenge = await this.dailyChallengeRepository.findById(id);
    if (!dailyChallenge) {
      throw new NotFoundException(`DailyChallenge with id "${id}" not found`);
    }
    return dailyChallenge;
  }
}
