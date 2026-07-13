import { UserDailyProgressEntity } from '../entities/user-progress.entity';

export const USER_PROGRESS_REPOSITORY = 'USER_PROGRESS_REPOSITORY';

export interface CreateUserProgressInput {
  userId: string;
  dailyChallengeId: number;
  guessedChampions?: number[];
  isWon?: boolean;
}

export interface UpdateUserProgressInput {
  id: number;
  guessedChampions?: number[];
  isWon?: boolean;
  moves?: number;
  timeElapsed?: number;
}

export interface IUserProgressRepository {
  findByUserAndChallenge(userId: string, dailyChallengeId: number): Promise<UserDailyProgressEntity | null>;
  create(data: CreateUserProgressInput): Promise<UserDailyProgressEntity>;
  update(data: UpdateUserProgressInput): Promise<UserDailyProgressEntity>;
}
