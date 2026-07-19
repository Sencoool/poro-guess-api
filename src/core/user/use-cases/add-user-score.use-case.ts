import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../repositories/user.repository.interface';
import type { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity, Rank } from '../entities/user.entity';
import { RANK_THRESHOLDS } from './update-user-rank.use-case';

export interface AddUserScoreCommand {
  id: string;
  scoreToAdd: number;
}

export interface AddUserScoreResult {
  user: UserEntity;
  isRankUp: boolean;
  previousRank: Rank;
}

@Injectable()
export class AddUserScoreUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: AddUserScoreCommand): Promise<AddUserScoreResult> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new NotFoundException(`User with id "${command.id}" not found`);
    }

    const newScore = user.score + command.scoreToAdd;
    let newRank = Rank.IRON;

    // Determine new rank based on total score
    for (const threshold of RANK_THRESHOLDS) {
      if (newScore >= threshold.minScore) {
        newRank = threshold.rank;
        break;
      }
    }

    const previousRank = user.rank;
    const isRankUp = previousRank !== newRank;

    const updatedUser = await this.userRepository.update(command.id, {
      score: newScore,
      rank: newRank,
    });

    return {
      user: updatedUser,
      isRankUp,
      previousRank,
    };
  }
}
