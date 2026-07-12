// src/core/daily-challenge/use-cases/create-daily-challenge.use-case.ts

import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { DailyChallengeEntity } from '../entities/daily-challenge.entity';
import { DAILY_CHALLENGE_REPOSITORY, CreateDailyChallengeInput } from '../repositories/daily-challenge.repository.interface';
import type { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';

export interface CreateDailyChallengeCommand extends CreateDailyChallengeInput {}

@Injectable()
export class CreateDailyChallengeUseCase {
  constructor(
    @Inject(DAILY_CHALLENGE_REPOSITORY)
    private readonly dailyChallengeRepository: IDailyChallengeRepository,
  ) {}

  async execute(command: CreateDailyChallengeCommand): Promise<DailyChallengeEntity> {
    return this.dailyChallengeRepository.create(command);
  }
}
