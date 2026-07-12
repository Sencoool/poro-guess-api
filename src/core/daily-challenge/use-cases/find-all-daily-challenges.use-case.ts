// src/core/daily-challenge/use-cases/find-all-daily-challenges.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { DAILY_CHALLENGE_REPOSITORY } from '../repositories/daily-challenge.repository.interface';
import type { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity } from '../entities/daily-challenge.entity';

@Injectable()
export class FindAllDailyChallengesUseCase {
  constructor(
    @Inject(DAILY_CHALLENGE_REPOSITORY)
    private readonly dailyChallengeRepository: IDailyChallengeRepository,
  ) {}

  async execute(): Promise<DailyChallengeEntity[]> {
    return this.dailyChallengeRepository.findAll();
  }
}
