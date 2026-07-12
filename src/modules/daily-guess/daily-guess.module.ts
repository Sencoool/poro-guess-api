// src/modules/daily-guess/daily-guess.module.ts

import { Module } from '@nestjs/common';
import { DailyGuessController } from './daily-guess.controller';

import { CreateDailyGuessUseCase } from '../../core/daily-guess/use-cases/create-daily-guess.use-case';
import { FindAllDailyGuessesUseCase } from '../../core/daily-guess/use-cases/find-all-daily-guesses.use-case';
import { FindDailyGuessByIdUseCase } from '../../core/daily-guess/use-cases/find-daily-guess-by-id.use-case';
import { UpdateDailyGuessUseCase } from '../../core/daily-guess/use-cases/update-daily-guess.use-case';
import { DeleteDailyGuessUseCase } from '../../core/daily-guess/use-cases/delete-daily-guess.use-case';

import { DailyGuessPrismaRepository } from '../../infrastructure/prisma/repositories/daily-guess.prisma.repository';
import { DAILY_GUESS_REPOSITORY } from '../../core/daily-guess/repositories/daily-guess.repository.interface';

@Module({
  controllers: [DailyGuessController],
  providers: [
    {
      provide: DAILY_GUESS_REPOSITORY,
      useClass: DailyGuessPrismaRepository,
    },
    CreateDailyGuessUseCase,
    FindAllDailyGuessesUseCase,
    FindDailyGuessByIdUseCase,
    UpdateDailyGuessUseCase,
    DeleteDailyGuessUseCase,
  ],
})
export class DailyGuessModule {}
