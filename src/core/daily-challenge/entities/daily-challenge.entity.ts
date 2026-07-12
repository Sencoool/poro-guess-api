// src/core/daily-challenge/entities/daily-challenge.entity.ts

export enum Mode {
  CLASSIC = 'CLASSIC',
  JIGSAW = 'JIGSAW',
  TRAITS = 'TRAITS',
}

export class DailyChallengeEntity {
  id: number;
  mode: Mode;
  championsId: number;

  constructor(partial: Partial<DailyChallengeEntity>) {
    Object.assign(this, partial);
  }
}
