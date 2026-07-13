import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_PROGRESS_REPOSITORY } from '../repositories/user-progress.repository.interface';
import type { IUserProgressRepository } from '../repositories/user-progress.repository.interface';
import { UserDailyProgressEntity } from '../entities/user-progress.entity';

@Injectable()
export class GetUserProgressUseCase {
  constructor(
    @Inject(USER_PROGRESS_REPOSITORY)
    private readonly userProgressRepository: IUserProgressRepository,
  ) {}

  async execute(userId: string, dailyChallengeId: number): Promise<UserDailyProgressEntity> {
    const progress = await this.userProgressRepository.findByUserAndChallenge(userId, dailyChallengeId);
    if (!progress) {
      throw new NotFoundException('User progress not found for this challenge');
    }
    return progress;
  }
}
