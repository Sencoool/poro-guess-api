import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ChampionModule } from './modules/champion/champion.module';
import { DailyChallengeModule } from './modules/daily-challenge/daily-challenge.module';
import { DailyGuessModule } from './modules/daily-guess/daily-guess.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cron/cron.module';
import { UserProgressModule } from './modules/user-progress/user-progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    ChampionModule,
    DailyChallengeModule,
    DailyGuessModule,
    CronModule,
    UserProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
