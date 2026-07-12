// src/core/daily-guess/use-cases/find-daily-guess-by-id.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DAILY_GUESS_REPOSITORY } from '../repositories/daily-guess.repository.interface';
import type { IDailyGuessRepository } from '../repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from '../entities/daily-guess.entity';

@Injectable()
export class FindDailyGuessByIdUseCase {
  constructor(
    @Inject(DAILY_GUESS_REPOSITORY)
    private readonly dailyGuessRepository: IDailyGuessRepository,
  ) {}

  async execute(id: number): Promise<DailyGuessEntity> {
    const dailyGuess = await this.dailyGuessRepository.findById(id);
    if (!dailyGuess) {
      throw new NotFoundException(`DailyGuess with id "${id}" not found`);
    }
    return dailyGuess;
  }
}
