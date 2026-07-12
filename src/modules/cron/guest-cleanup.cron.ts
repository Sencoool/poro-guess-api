import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeleteInactiveGuestsUseCase } from '../../core/user/use-cases/delete-inactive-guests.use-case';

@Injectable()
export class GuestCleanupCron {
  private readonly logger = new Logger(GuestCleanupCron.name);

  constructor(
    private readonly deleteInactiveGuestsUseCase: DeleteInactiveGuestsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running daily guest cleanup cron job...');
    try {
      const deletedCount = await this.deleteInactiveGuestsUseCase.execute(7);
      this.logger.log(`Cron job finished. Deleted ${deletedCount} accounts.`);
    } catch (error) {
      this.logger.error('Failed to run guest cleanup cron job', error);
    }
  }
}
