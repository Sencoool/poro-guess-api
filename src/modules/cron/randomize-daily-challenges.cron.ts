import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RandomizeDailyChallengesUseCase } from '../../core/daily-challenge/use-cases/randomize-daily-challenges.use-case';

@Injectable()
export class RandomizeDailyChallengesCron {
  private readonly logger = new Logger(RandomizeDailyChallengesCron.name);

  constructor(
    private readonly randomizeDailyChallengesUseCase: RandomizeDailyChallengesUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running daily challenge randomization cron job...');
    try {
      await this.randomizeDailyChallengesUseCase.execute();
      this.logger.log('Cron job finished successfully.');
    } catch (error) {
      this.logger.error('Failed to run randomize daily challenges cron job', error);
    }
  }
}
