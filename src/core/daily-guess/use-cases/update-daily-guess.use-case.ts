// src/core/daily-guess/use-cases/update-daily-guess.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DAILY_GUESS_REPOSITORY } from '../repositories/daily-guess.repository.interface';
import type { IDailyGuessRepository, UpdateDailyGuessInput } from '../repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from '../entities/daily-guess.entity';

export interface UpdateDailyGuessCommand {
  id: number;
  guessCount?: number;
  championsId?: number;
  dailyChallengeId?: number;
}

@Injectable()
export class UpdateDailyGuessUseCase {
  constructor(
    @Inject(DAILY_GUESS_REPOSITORY)
    private readonly dailyGuessRepository: IDailyGuessRepository,
  ) {}

  async execute(command: UpdateDailyGuessCommand): Promise<DailyGuessEntity> {
    const dailyGuess = await this.dailyGuessRepository.findById(command.id);
    if (!dailyGuess) {
      throw new NotFoundException(`DailyGuess with id "${command.id}" not found`);
    }

    const updateData: UpdateDailyGuessInput = {};
    if (command.guessCount !== undefined) updateData.guessCount = command.guessCount;
    if (command.championsId !== undefined) updateData.championsId = command.championsId;
    if (command.dailyChallengeId !== undefined) updateData.dailyChallengeId = command.dailyChallengeId;

    return this.dailyGuessRepository.update(command.id, updateData);
  }
}
