// src/core/daily-guess/repositories/daily-guess.repository.interface.ts

import { DailyGuessEntity } from '../entities/daily-guess.entity';

export interface CreateDailyGuessInput {
  guessCount?: number;
  championsId: number;
  dailyChallengeId: number;
}

export interface UpdateDailyGuessInput {
  guessCount?: number;
  championsId?: number;
  dailyChallengeId?: number;
}

export interface IDailyGuessRepository {
  create(data: CreateDailyGuessInput): Promise<DailyGuessEntity>;
  findAll(): Promise<DailyGuessEntity[]>;
  findById(id: number): Promise<DailyGuessEntity | null>;
  update(id: number, data: UpdateDailyGuessInput): Promise<DailyGuessEntity>;
  delete(id: number): Promise<void>;
  deleteAll(): Promise<number>;
  resetAllGuessCounts(): Promise<number>;
}

export const DAILY_GUESS_REPOSITORY = Symbol('IDailyGuessRepository');
