import { Module } from '@nestjs/common';
import { GuestCleanupCron } from './guest-cleanup.cron';
import { RandomizeDailyChallengesCron } from './randomize-daily-challenges.cron';
import { UserModule } from '../user/user.module';
import { DailyChallengeModule } from '../daily-challenge/daily-challenge.module';

@Module({
  imports: [UserModule, DailyChallengeModule],
  providers: [GuestCleanupCron, RandomizeDailyChallengesCron],
})
export class CronModule {}
