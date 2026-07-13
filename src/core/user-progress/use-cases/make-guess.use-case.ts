import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { USER_PROGRESS_REPOSITORY } from '../repositories/user-progress.repository.interface';
import type { IUserProgressRepository } from '../repositories/user-progress.repository.interface';
import { DAILY_CHALLENGE_REPOSITORY } from '../../daily-challenge/repositories/daily-challenge.repository.interface';
import type { IDailyChallengeRepository } from '../../daily-challenge/repositories/daily-challenge.repository.interface';
import { USER_REPOSITORY } from '../../user/repositories/user.repository.interface';
import type { IUserRepository } from '../../user/repositories/user.repository.interface';
import { CHAMPION_REPOSITORY } from '../../champion/repositories/champion.repository.interface';
import type { IChampionRepository } from '../../champion/repositories/champion.repository.interface';
import { UserDailyProgressEntity } from '../entities/user-progress.entity';
import { compareChampions } from '../utils/comparison.util';
import { ChampionGuessResult } from '../types';

export interface MakeGuessCommand {
  userId: string;
  dailyChallengeId: number;
  championId?: number;
  moves?: number;
  timeElapsed?: number;
  isWon?: boolean;
}

export interface MakeGuessResult {
  progress: UserDailyProgressEntity;
  guesses: ChampionGuessResult[];
  hint?: string;
  traits?: string[];
  targetChampionId?: number;
}

@Injectable()
export class MakeGuessUseCase {
  constructor(
    @Inject(USER_PROGRESS_REPOSITORY)
    private readonly userProgressRepository: IUserProgressRepository,
    @Inject(DAILY_CHALLENGE_REPOSITORY)
    private readonly dailyChallengeRepository: IDailyChallengeRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(CHAMPION_REPOSITORY)
    private readonly championRepository: IChampionRepository,
  ) {}

  async execute(command: MakeGuessCommand): Promise<MakeGuessResult> {
    const { userId, dailyChallengeId, championId, moves, timeElapsed, isWon } = command;

    const challenge = await this.dailyChallengeRepository.findById(dailyChallengeId);
    if (!challenge || challenge.championsId === null) {
      throw new NotFoundException('Daily challenge not found or invalid');
    }

    const targetChampion = await this.championRepository.findById(challenge.championsId as number);
    if (!targetChampion) {
      throw new NotFoundException('Target champion not found');
    }

    let progress = await this.userProgressRepository.findByUserAndChallenge(userId, dailyChallengeId);
    if (!progress) {
      progress = await this.userProgressRepository.create({
        userId,
        dailyChallengeId,
        guessedChampions: [],
        isWon: false,
      });
    }

    if (progress.isWon) {
      throw new BadRequestException('You have already won this challenge');
    }

    if (challenge.mode === 'TRAITS' && progress.guessedChampions.length >= 5) {
      throw new BadRequestException('You have reached the maximum number of guesses for Traits mode.');
    }

    let isCorrect = false;
    let updatedGuessedChampions = progress.guessedChampions;

    if (championId !== undefined) {
      if (progress.guessedChampions.includes(championId)) {
        throw new BadRequestException('You have already guessed this champion');
      }
      isCorrect = challenge.championsId === championId;
      updatedGuessedChampions = [...progress.guessedChampions, championId];
    } else {
      isCorrect = isWon ?? false;
    }

    const updatedProgress = await this.userProgressRepository.update({
      id: progress.id,
      guessedChampions: updatedGuessedChampions,
      isWon: isCorrect,
      moves,
      timeElapsed,
    });

    if (isCorrect) {
      await this.updateStreakAndScore(userId, updatedGuessedChampions.length);
    }

    // Build the guess history with comparisons
    const guesses: ChampionGuessResult[] = [];
    for (const id of updatedGuessedChampions) {
      const guessedChamp = await this.championRepository.findById(id);
      if (guessedChamp) {
        guesses.push({
          champion: guessedChamp.toPublic(),
          comparison: compareChampions(guessedChamp, targetChampion)
        });
      }
    }

    // Reveal hint if they have guessed 3 or more times
    let hint: string | undefined = undefined;
    if (updatedGuessedChampions.length >= 3 || isCorrect) {
      hint = targetChampion.hint;
    }

    // Traits mode logic: unlock hints based on guesses
    let traits: string[] | undefined = undefined;
    if (challenge.mode === 'TRAITS') {
      const hintsToReveal = isCorrect ? 5 : Math.min(5, updatedGuessedChampions.length + 1);
      traits = targetChampion.traits.slice(0, hintsToReveal);
    }

    return {
      progress: updatedProgress,
      guesses,
      hint,
      traits,
      targetChampionId: isCorrect ? targetChampion.id : undefined,
    };
  }

  private async updateStreakAndScore(userId: string, guessCount: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = user.streak;
    
    if (user.lastPlayedAt) {
      const lastPlayed = new Date(user.lastPlayedAt);
      lastPlayed.setHours(0, 0, 0, 0);
      
      const diffTime = Math.abs(today.getTime() - lastPlayed.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
      // If diffDays === 0, already played today, streak remains the same
    } else {
      newStreak = 1;
    }

    // Score logic: 5 points max, deduct 1 per wrong guess, min 1 point
    const scoreGain = Math.max(1, 5 - (guessCount - 1));
    const newScore = user.score + scoreGain;
    
    // Dynamic import to avoid circular dependency, or just import at top. Let's assume we can calculate rank inline if needed.
    // Actually, we can just require or import the UserEntity here.
    const { UserEntity } = require('../../user/entities/user.entity');
    const newRank = UserEntity.calculateRank(newScore);

    await this.userRepository.update(userId, {
      streak: newStreak,
      score: newScore,
      rank: newRank,
      lastPlayedAt: new Date(),
    });
  }
}
