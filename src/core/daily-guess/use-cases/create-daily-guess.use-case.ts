// src/core/daily-guess/use-cases/create-daily-guess.use-case.ts

import { Injectable, Inject } from '@nestjs/common';
import { DailyGuessEntity } from '../entities/daily-guess.entity';
import { DAILY_GUESS_REPOSITORY, CreateDailyGuessInput } from '../repositories/daily-guess.repository.interface';
import type { IDailyGuessRepository } from '../repositories/daily-guess.repository.interface';

export interface CreateDailyGuessCommand extends CreateDailyGuessInput {}

@Injectable()
export class CreateDailyGuessUseCase {
  constructor(
    @Inject(DAILY_GUESS_REPOSITORY)
    private readonly dailyGuessRepository: IDailyGuessRepository,
  ) {}

  async execute(command: CreateDailyGuessCommand): Promise<DailyGuessEntity> {
    return this.dailyGuessRepository.create(command);
  }
}
