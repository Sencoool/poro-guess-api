// src/core/daily-challenge/use-cases/delete-daily-challenge.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DAILY_CHALLENGE_REPOSITORY } from '../repositories/daily-challenge.repository.interface';
import type { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';

@Injectable()
export class DeleteDailyChallengeUseCase {
  constructor(
    @Inject(DAILY_CHALLENGE_REPOSITORY)
    private readonly dailyChallengeRepository: IDailyChallengeRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const dailyChallenge = await this.dailyChallengeRepository.findById(id);
    if (!dailyChallenge) {
      throw new NotFoundException(`DailyChallenge with id "${id}" not found`);
    }
    await this.dailyChallengeRepository.delete(id);
  }
}
