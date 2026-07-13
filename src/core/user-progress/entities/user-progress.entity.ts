export class UserDailyProgressEntity {
  id: number;
  userId: string;
  dailyChallengeId: number;
  guessedChampions: number[];
  isWon: boolean;
  moves?: number;
  timeElapsed?: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserDailyProgressEntity>) {
    Object.assign(this, partial);
  }
}
