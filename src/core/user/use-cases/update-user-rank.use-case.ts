import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../repositories/user.repository.interface';
import type { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity, Rank } from '../entities/user.entity';

export interface UpdateUserRankCommand {
  id: string;
}

export const RANK_THRESHOLDS = [
  { rank: Rank.CHALLENGER, minScore: 2700 }, // ~135 days (4.5 months) of perfect play
  { rank: Rank.GRANDMASTER, minScore: 2200 }, // ~110 days
  { rank: Rank.MASTER, minScore: 1750 }, // ~87.5 days
  { rank: Rank.DIAMOND, minScore: 1350 }, // ~67.5 days
  { rank: Rank.EMERALD, minScore: 1000 }, // ~50 days
  { rank: Rank.PLATINUM, minScore: 700 }, // ~35 days
  { rank: Rank.GOLD, minScore: 450 }, // ~22.5 days
  { rank: Rank.SILVER, minScore: 250 }, // ~12.5 days
  { rank: Rank.BRONZE, minScore: 100 }, // ~5 days
  { rank: Rank.IRON, minScore: 0 },
];

@Injectable()
export class UpdateUserRankUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserRankCommand): Promise<UserEntity> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new NotFoundException(`User with id "${command.id}" not found`);
    }

    const currentScore = user.score;
    let newRank = Rank.IRON;

    for (const threshold of RANK_THRESHOLDS) {
      if (currentScore >= threshold.minScore) {
        newRank = threshold.rank;
        break;
      }
    }

    if (user.rank !== newRank) {
      return this.userRepository.update(command.id, { rank: newRank });
    }

    return user;
  }
}
