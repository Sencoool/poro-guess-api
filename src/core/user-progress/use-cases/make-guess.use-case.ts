import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { USER_PROGRESS_REPOSITORY } from '../repositories/user-progress.repository.interface';
import type { IUserProgressRepository } from '../repositories/user-progress.repository.interface';
import { DAILY_CHALLENGE_REPOSITORY } from '../../daily-challenge/repositories/daily-challenge.repository.interface';
import type { IDailyChallengeRepository } from '../../daily-challenge/repositories/daily-challenge.repository.interface';
import { USER_REPOSITORY } from '../../user/repositories/user.repository.interface';
import type { IUserRepository } from '../../user/repositories/user.repository.interface';
import { UserDailyProgressEntity } from '../entities/user-progress.entity';

export interface MakeGuessCommand {
  userId: string;
  dailyChallengeId: number;
  championId?: number;
  moves?: number;
  timeElapsed?: number;
  isWon?: boolean;
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
  ) {}

  async execute(command: MakeGuessCommand): Promise<UserDailyProgressEntity> {
    const { userId, dailyChallengeId, championId, moves, timeElapsed, isWon } = command;

    const challenge = await this.dailyChallengeRepository.findById(dailyChallengeId);
    if (!challenge) {
      throw new NotFoundException('Daily challenge not found');
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
      await this.updateStreak(userId);
    }

    return updatedProgress;
  }

  private async updateStreak(userId: string) {
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

    await this.userRepository.update(userId, {
      streak: newStreak,
      lastPlayedAt: new Date(),
    });
  }
}
