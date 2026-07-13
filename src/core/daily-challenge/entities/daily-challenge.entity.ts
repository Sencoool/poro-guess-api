// src/core/daily-challenge/entities/daily-challenge.entity.ts

export enum Mode {
  CLASSIC = 'CLASSIC',
  JIGSAW = 'JIGSAW',
  TRAITS = 'TRAITS',
  MATCHER = 'MATCHER',
}

export class DailyChallengeEntity {
  id: number;
  mode: Mode;
  championsId?: number;
  imagePath?: string;
  matcherChampions: number[];

  constructor(partial: Partial<DailyChallengeEntity>) {
    Object.assign(this, partial);
    if (!this.matcherChampions) {
      this.matcherChampions = [];
    }
  }
}
