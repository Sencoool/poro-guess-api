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
import { ChampionEntity } from '../../champion/entities/champion.entity';

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
    if (!challenge) {
      throw new NotFoundException('Daily challenge not found or invalid');
    }

    let targetChampion: ChampionEntity | null = null;
    if (challenge.mode !== 'MATCHER') {
      if (challenge.championsId == null) {
        throw new NotFoundException('Daily challenge not found or invalid');
      }
      targetChampion = await this.championRepository.findById(challenge.championsId);
      if (!targetChampion) {
        throw new NotFoundException('Target champion not found');
      }
    }

    // Build the guess history with comparisons
    const guesses: ChampionGuessResult[] = [];
    if (targetChampion) {
      for (const id of progress.guessedChampions) {
        const guessedChamp = await this.championRepository.findById(id);
        if (guessedChamp) {
          guesses.push({
            champion: guessedChamp.toPublic(),
            comparison: compareChampions(guessedChamp, targetChampion)
          });
        }
      }
    }

    // Reveal hint if they have guessed 3 or more times (for Classic)
    let hint: string | undefined = undefined;
    if (targetChampion && (progress.guessedChampions.length >= 3 || progress.isWon)) {
      hint = targetChampion.hint;
    }

    // Traits mode logic: send all 5 traits to frontend so it can manage reveals (Client-Side State)
    let traits: string[] | undefined = undefined;
    if (challenge.mode === 'TRAITS' && targetChampion) {
      traits = targetChampion.traits.slice(0, 5);
    }

    return {
      progress,
      guesses,
      hint,
      traits,
      targetChampionId: progress.isWon && targetChampion ? targetChampion.id : undefined,
    };
  }
}
