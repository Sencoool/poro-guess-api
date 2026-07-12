// src/core/daily-guess/entities/daily-guess.entity.ts

export class DailyGuessEntity {
  id: number;
  guessCount: number;
  championsId: number;
  dailyChallengeId: number;

  constructor(partial: Partial<DailyGuessEntity>) {
    Object.assign(this, partial);
  }
}
