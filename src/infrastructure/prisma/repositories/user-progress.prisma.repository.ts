import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUserProgressRepository, CreateUserProgressInput, UpdateUserProgressInput } from '../../../core/user-progress/repositories/user-progress.repository.interface';
import { UserDailyProgressEntity } from '../../../core/user-progress/entities/user-progress.entity';

@Injectable()
export class UserProgressPrismaRepository implements IUserProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndChallenge(userId: string, dailyChallengeId: number): Promise<UserDailyProgressEntity | null> {
    const progress = await this.prisma.client.userDailyProgress.findUnique({
      where: {
        userId_dailyChallengeId: {
          userId,
          dailyChallengeId,
        },
      },
    });

    if (!progress) return null;
    return new UserDailyProgressEntity({
      ...progress,
      moves: progress.moves ?? undefined,
      timeElapsed: progress.timeElapsed ?? undefined,
    });
  }

  async create(data: CreateUserProgressInput): Promise<UserDailyProgressEntity> {
    const progress = await this.prisma.client.userDailyProgress.create({
      data: {
        userId: data.userId,
        dailyChallengeId: data.dailyChallengeId,
        guessedChampions: data.guessedChampions ?? [],
        isWon: data.isWon ?? false,
      },
    });
    return new UserDailyProgressEntity({
      ...progress,
      moves: progress.moves ?? undefined,
      timeElapsed: progress.timeElapsed ?? undefined,
    });
  }

  async update(data: UpdateUserProgressInput): Promise<UserDailyProgressEntity> {
    const progress = await this.prisma.client.userDailyProgress.update({
      where: { id: data.id },
      data: {
        ...(data.guessedChampions && { guessedChampions: data.guessedChampions }),
        ...(data.isWon !== undefined && { isWon: data.isWon }),
        ...(data.moves !== undefined && { moves: data.moves }),
        ...(data.timeElapsed !== undefined && { timeElapsed: data.timeElapsed }),
      },
    });
    return new UserDailyProgressEntity({
      ...progress,
      moves: progress.moves ?? undefined,
      timeElapsed: progress.timeElapsed ?? undefined,
    });
  }
}
