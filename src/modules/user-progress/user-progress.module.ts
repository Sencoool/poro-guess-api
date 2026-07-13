import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { UserProgressController } from './user-progress.controller';
import { USER_PROGRESS_REPOSITORY } from '../../core/user-progress/repositories/user-progress.repository.interface';
import { UserProgressPrismaRepository } from '../../infrastructure/prisma/repositories/user-progress.prisma.repository';
import { GetUserProgressUseCase } from '../../core/user-progress/use-cases/get-user-progress.use-case';
import { MakeGuessUseCase } from '../../core/user-progress/use-cases/make-guess.use-case';
import { DAILY_CHALLENGE_REPOSITORY } from '../../core/daily-challenge/repositories/daily-challenge.repository.interface';
import { DailyChallengePrismaRepository } from '../../infrastructure/prisma/repositories/daily-challenge.prisma.repository';
import { USER_REPOSITORY } from '../../core/user/repositories/user.repository.interface';
import { UserPrismaRepository } from '../../infrastructure/prisma/repositories/user.prisma.repository';
import { CHAMPION_REPOSITORY } from '../../core/champion/repositories/champion.repository.interface';
import { ChampionPrismaRepository } from '../../infrastructure/prisma/repositories/champion.prisma.repository';

@Module({
  controllers: [UserProgressController],
  providers: [
    PrismaService,
    {
      provide: USER_PROGRESS_REPOSITORY,
      useClass: UserProgressPrismaRepository,
    },
    {
      provide: DAILY_CHALLENGE_REPOSITORY,
      useClass: DailyChallengePrismaRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: CHAMPION_REPOSITORY,
      useClass: ChampionPrismaRepository,
    },
    GetUserProgressUseCase,
    MakeGuessUseCase,
  ],
  exports: [USER_PROGRESS_REPOSITORY],
})
export class UserProgressModule {}
