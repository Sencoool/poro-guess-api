import { Injectable, Inject, Logger, InternalServerErrorException } from '@nestjs/common';
import { DAILY_CHALLENGE_REPOSITORY } from './../repositories/daily-challenge.repository.interface';
import type { IDailyChallengeRepository } from './../repositories/daily-challenge.repository.interface';
import { DAILY_GUESS_REPOSITORY } from '../../daily-guess/repositories/daily-guess.repository.interface';
import type { IDailyGuessRepository } from '../../daily-guess/repositories/daily-guess.repository.interface';
import { CHAMPION_REPOSITORY } from '../../champion/repositories/champion.repository.interface';
import type { IChampionRepository } from '../../champion/repositories/champion.repository.interface';
import { Mode } from '../entities/daily-challenge.entity';

@Injectable()
export class RandomizeDailyChallengesUseCase {
  private readonly logger = new Logger(RandomizeDailyChallengesUseCase.name);

  constructor(
    @Inject(DAILY_CHALLENGE_REPOSITORY)
    private readonly dailyChallengeRepository: IDailyChallengeRepository,
    @Inject(DAILY_GUESS_REPOSITORY)
    private readonly dailyGuessRepository: IDailyGuessRepository,
    @Inject(CHAMPION_REPOSITORY)
    private readonly championRepository: IChampionRepository,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Starting daily challenge randomization process...');

    // 1. Fetch all champions to select random ones
    const allChampions = await this.championRepository.findAll();
    if (allChampions.length < 19) {
      this.logger.error('Not enough champions in database to randomize daily challenges (need at least 19).');
      throw new InternalServerErrorException('Not enough champions');
    }

    // 2. Shuffle and pick 19 distinct champions (3 for single-answer modes, 16 for MATCHER)
    const shuffled = allChampions.sort(() => 0.5 - Math.random());
    const selectedChampions = shuffled.slice(0, 19);

    // 3. Delete old daily guesses to prevent constraint violations
    this.logger.log('Deleting old daily guesses...');
    const deletedGuesses = await this.dailyGuessRepository.deleteAll();
    this.logger.log(`Deleted ${deletedGuesses} daily guesses.`);

    // 4. Delete old daily challenges
    this.logger.log('Deleting old daily challenges...');
    const deletedChallenges = await this.dailyChallengeRepository.deleteAll();
    this.logger.log(`Deleted ${deletedChallenges} old daily challenges.`);

    // 5. Create 4 new daily challenges
    const modes = [Mode.CLASSIC, Mode.JIGSAW, Mode.TRAITS, Mode.MATCHER];
    
    this.logger.log('Creating 4 new daily challenges...');
    for (let i = 0; i < modes.length; i++) {
      const mode = modes[i];
      
      if (mode === Mode.MATCHER) {
        const matcherChamps = selectedChampions.slice(3, 19).map(c => c.id);
        await this.dailyChallengeRepository.create({
          mode,
          matcherChampions: matcherChamps,
        });
        this.logger.log(`Created new challenge for mode ${mode} with 16 matcher champions`);
      } else {
        const championId = selectedChampions[i].id;
        await this.dailyChallengeRepository.create({
          mode,
          championsId: championId,
        });
        this.logger.log(`Created new challenge for mode ${mode} with Champion ID ${championId}`);
      }
    }

    this.logger.log('Daily challenge randomization completed successfully.');
  }
}
