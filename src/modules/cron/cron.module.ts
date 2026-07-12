import { Module } from '@nestjs/common';
import { GuestCleanupCron } from './guest-cleanup.cron';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [GuestCleanupCron],
})
export class CronModule {}
