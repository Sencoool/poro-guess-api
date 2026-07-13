// src/core/daily-challenge/repositories/daily-challenge.repository.interface.ts

import { DailyChallengeEntity, Mode } from '../entities/daily-challenge.entity';

export interface CreateDailyChallengeInput {
  mode: Mode;
  championsId?: number;
  matcherChampions?: number[];
}

export interface UpdateDailyChallengeInput {
  mode?: Mode;
  championsId?: number;
  matcherChampions?: number[];
}

export interface IDailyChallengeRepository {
  create(data: CreateDailyChallengeInput): Promise<DailyChallengeEntity>;
  findAll(): Promise<DailyChallengeEntity[]>;
  findById(id: number): Promise<DailyChallengeEntity | null>;
  update(id: number, data: UpdateDailyChallengeInput): Promise<DailyChallengeEntity>;
  delete(id: number): Promise<void>;
  deleteAll(): Promise<number>;
}

export const DAILY_CHALLENGE_REPOSITORY = Symbol('IDailyChallengeRepository');
