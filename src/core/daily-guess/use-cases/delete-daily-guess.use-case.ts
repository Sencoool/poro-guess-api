// src/core/daily-guess/use-cases/delete-daily-guess.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DAILY_GUESS_REPOSITORY } from '../repositories/daily-guess.repository.interface';
import type { IDailyGuessRepository } from '../repositories/daily-guess.repository.interface';

@Injectable()
export class DeleteDailyGuessUseCase {
  constructor(
    @Inject(DAILY_GUESS_REPOSITORY)
    private readonly dailyGuessRepository: IDailyGuessRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const dailyGuess = await this.dailyGuessRepository.findById(id);
    if (!dailyGuess) {
      throw new NotFoundException(`DailyGuess with id "${id}" not found`);
    }
    await this.dailyGuessRepository.delete(id);
  }
}
