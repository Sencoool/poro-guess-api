// src/core/daily-guess/use-cases/find-all-daily-guesses.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { DAILY_GUESS_REPOSITORY } from '../repositories/daily-guess.repository.interface';
import type { IDailyGuessRepository } from '../repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from '../entities/daily-guess.entity';

@Injectable()
export class FindAllDailyGuessesUseCase {
  constructor(
    @Inject(DAILY_GUESS_REPOSITORY)
    private readonly dailyGuessRepository: IDailyGuessRepository,
  ) {}

  async execute(): Promise<DailyGuessEntity[]> {
    return this.dailyGuessRepository.findAll();
  }
}
