// src/modules/daily-challenge/daily-challenge.module.ts

import { Module } from '@nestjs/common';
import { DailyChallengeController } from './daily-challenge.controller';

import { CreateDailyChallengeUseCase } from '../../core/daily-challenge/use-cases/create-daily-challenge.use-case';
import { FindAllDailyChallengesUseCase } from '../../core/daily-challenge/use-cases/find-all-daily-challenges.use-case';
import { FindDailyChallengeByIdUseCase } from '../../core/daily-challenge/use-cases/find-daily-challenge-by-id.use-case';
import { UpdateDailyChallengeUseCase } from '../../core/daily-challenge/use-cases/update-daily-challenge.use-case';
import { DeleteDailyChallengeUseCase } from '../../core/daily-challenge/use-cases/delete-daily-challenge.use-case';

import { DailyChallengePrismaRepository } from '../../infrastructure/prisma/repositories/daily-challenge.prisma.repository';
import { DAILY_CHALLENGE_REPOSITORY } from '../../core/daily-challenge/repositories/daily-challenge.repository.interface';

@Module({
  controllers: [DailyChallengeController],
  providers: [
    {
      provide: DAILY_CHALLENGE_REPOSITORY,
      useClass: DailyChallengePrismaRepository,
    },
    CreateDailyChallengeUseCase,
    FindAllDailyChallengesUseCase,
    FindDailyChallengeByIdUseCase,
    UpdateDailyChallengeUseCase,
    DeleteDailyChallengeUseCase,
  ],
})
export class DailyChallengeModule {}
