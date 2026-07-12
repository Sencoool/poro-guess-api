// src/core/daily-challenge/use-cases/update-daily-challenge.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DAILY_CHALLENGE_REPOSITORY } from '../repositories/daily-challenge.repository.interface';
import type { IDailyChallengeRepository, UpdateDailyChallengeInput } from '../repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity, Mode } from '../entities/daily-challenge.entity';

export interface UpdateDailyChallengeCommand {
  id: number;
  mode?: Mode;
  championsId?: number;
}

@Injectable()
export class UpdateDailyChallengeUseCase {
  constructor(
    @Inject(DAILY_CHALLENGE_REPOSITORY)
    private readonly dailyChallengeRepository: IDailyChallengeRepository,
  ) {}

  async execute(command: UpdateDailyChallengeCommand): Promise<DailyChallengeEntity> {
    const dailyChallenge = await this.dailyChallengeRepository.findById(command.id);
    if (!dailyChallenge) {
      throw new NotFoundException(`DailyChallenge with id "${command.id}" not found`);
    }

    const updateData: UpdateDailyChallengeInput = {};
    if (command.mode !== undefined) updateData.mode = command.mode;
    if (command.championsId !== undefined) updateData.championsId = command.championsId;

    return this.dailyChallengeRepository.update(command.id, updateData);
  }
}
