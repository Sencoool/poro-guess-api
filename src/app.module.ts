import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ChampionModule } from './modules/champion/champion.module';
import { DailyChallengeModule } from './modules/daily-challenge/daily-challenge.module';
import { DailyGuessModule } from './modules/daily-guess/daily-guess.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    ChampionModule,
    DailyChallengeModule,
    DailyGuessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
