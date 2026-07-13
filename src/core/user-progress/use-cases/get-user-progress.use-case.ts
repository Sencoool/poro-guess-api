import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_PROGRESS_REPOSITORY } from '../repositories/user-progress.repository.interface';
import type { IUserProgressRepository } from '../repositories/user-progress.repository.interface';
import { DAILY_CHALLENGE_REPOSITORY } from '../../daily-challenge/repositories/daily-challenge.repository.interface';
import type { IDailyChallengeRepository } from '../../daily-challenge/repositories/daily-challenge.repository.interface';
import { CHAMPION_REPOSITORY } from '../../champion/repositories/champion.repository.interface';
import type { IChampionRepository } from '../../champion/repositories/champion.repository.interface';
import { MakeGuessResult } from './make-guess.use-case';
import { compareChampions } from '../utils/comparison.util';
import { ChampionGuessResult } from '../types';

@Injectable()
export class GetUserProgressUseCase {
  constructor(
    @Inject(USER_PROGRESS_REPOSITORY)
    private readonly userProgressRepository: IUserProgressRepository,
    @Inject(DAILY_CHALLENGE_REPOSITORY)
    private readonly dailyChallengeRepository: IDailyChallengeRepository,
    @Inject(CHAMPION_REPOSITORY)
    private readonly championRepository: IChampionRepository,
  ) {}

  async execute(userId: string, dailyChallengeId: number): Promise<MakeGuessResult> {
    const progress = await this.userProgressRepository.findByUserAndChallenge(userId, dailyChallengeId);
    if (!progress) {
      throw new NotFoundException('User progress not found for this challenge');
    }

    const challenge = await this.dailyChallengeRepository.findById(dailyChallengeId);
    if (!challenge || challenge.championsId === null) {
      throw new NotFoundException('Daily challenge not found or invalid');
    }

    const targetChampion = await this.championRepository.findById(challenge.championsId as number);
    if (!targetChampion) {
      throw new NotFoundException('Target champion not found');
    }

    // Build the guess history with comparisons
    const guesses: ChampionGuessResult[] = [];
    for (const id of progress.guessedChampions) {
      const guessedChamp = await this.championRepository.findById(id);
      if (guessedChamp) {
        guesses.push({
          champion: guessedChamp.toPublic(),
          comparison: compareChampions(guessedChamp, targetChampion)
        });
      }
    }

    // Reveal hint if they have guessed 3 or more times (for Classic)
    let hint: string | undefined = undefined;
    if (progress.guessedChampions.length >= 3 || progress.isWon) {
      hint = targetChampion.hint;
    }

    // Traits mode logic: unlock hints based on guesses
    let traits: string[] | undefined = undefined;
    if (challenge.mode === 'TRAITS') {
      const hintsToReveal = progress.isWon ? 5 : Math.min(5, progress.guessedChampions.length + 1);
      traits = targetChampion.traits.slice(0, hintsToReveal);
    }

    return {
      progress,
      guesses,
      hint,
      traits,
      targetChampionId: progress.isWon ? targetChampion.id : undefined,
    };
  }
}
