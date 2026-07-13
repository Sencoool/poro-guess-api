// src/core/user-progress/types.ts

import { ChampionEntity } from '../champion/entities/champion.entity';

export enum MatchStatus {
  MATCH = 'MATCH',
  PARTIAL = 'PARTIAL',
  WRONG = 'WRONG',
  HIGHER = 'HIGHER',
  LOWER = 'LOWER',
}

export interface ChampionAttributeComparison {
  gender: MatchStatus;
  role: MatchStatus;
  damageType: MatchStatus;
  resource: MatchStatus;
  rangeType: MatchStatus;
  yearRelease: MatchStatus;
}

export interface ChampionGuessResult {
  champion: Omit<ChampionEntity, 'toPublic'>;
  comparison: ChampionAttributeComparison;
}
