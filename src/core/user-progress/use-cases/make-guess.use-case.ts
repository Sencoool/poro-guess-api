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
import { ChampionEntity } from '../../champion/entities/champion.entity';

export interface MakeGuessCommand {
  userId: string;
  dailyChallengeId: number;
  championId?: number;
  moves?: number;
  timeElapsed?: number;
  isWon?: boolean;
  score?: number;
}

export interface MakeGuessResult {
  progress: UserDailyProgressEntity;
  guesses: ChampionGuessResult[];
  hint?: string;
  traits?: string[];
  targetChampionId?: number;
  stats?: {
    scoreGained: number;
    oldRank: string;
    newRank: string;
    oldStreak: number;
    newStreak: number;
    oldScore: number;
    newScore: number;
  };
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
    const { userId, dailyChallengeId, championId, moves, timeElapsed, isWon, score } = command;

    console.log('--- MAKE GUESS DEBUG ---');
    console.log('command:', command);
    console.log('dailyChallengeId type:', typeof dailyChallengeId, dailyChallengeId);

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

    let statsResult: any = undefined;
    if (isCorrect) {
      let scoreGain = 0;
      if (score !== undefined) {
        scoreGain = score;
      } else if (challenge.mode === 'CLASSIC') {
        scoreGain = Math.max(1, 5 - (updatedGuessedChampions.length - 1));
      } else {
        scoreGain = 1; // Fallback
      }
      statsResult = await this.updateStreakAndScore(userId, scoreGain);
    }

    // Build the guess history with comparisons
    const guesses: ChampionGuessResult[] = [];
    if (targetChampion) {
      for (const id of updatedGuessedChampions) {
        const guessedChamp = await this.championRepository.findById(id);
        if (guessedChamp) {
          guesses.push({
            champion: guessedChamp.toPublic(),
            comparison: compareChampions(guessedChamp, targetChampion)
          });
        }
      }
    }

    // Reveal hint if they have guessed 3 or more times
    let hint: string | undefined = undefined;
    if (targetChampion && (updatedGuessedChampions.length >= 3 || isCorrect)) {
      hint = targetChampion.hint;
    }

    // Traits mode logic: unlock hints based on guesses
    let traits: string[] | undefined = undefined;
    if (challenge.mode === 'TRAITS' && targetChampion) {
      const hintsToReveal = isCorrect ? 5 : Math.min(5, updatedGuessedChampions.length + 1);
      traits = targetChampion.traits.slice(0, hintsToReveal);
    }

    return {
      progress: updatedProgress,
      guesses,
      hint,
      traits,
      targetChampionId: isCorrect && targetChampion ? targetChampion.id : undefined,
      stats: statsResult,
    };
  }

  private async updateStreakAndScore(userId: string, scoreGain: number) {
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

    // Dynamic import to avoid circular dependency
    const newScore = user.score + scoreGain;
    const { UserEntity } = require('../../user/entities/user.entity');
    const oldRank = UserEntity.calculateRank(user.score);
    const newRank = UserEntity.calculateRank(newScore);

    await this.userRepository.update(userId, {
      streak: newStreak,
      score: newScore,
      rank: newRank,
      lastPlayedAt: new Date(),
    });

    return {
      scoreGained: scoreGain,
      oldRank: oldRank,
      newRank: newRank,
      oldStreak: user.streak,
      newStreak: newStreak,
      oldScore: user.score,
      newScore: newScore,
    };
  }
}
