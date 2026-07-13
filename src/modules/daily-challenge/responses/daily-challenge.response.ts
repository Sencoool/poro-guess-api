// src/modules/daily-challenge/responses/daily-challenge.response.ts

import { ApiProperty } from '@nestjs/swagger';
import { Mode, DailyChallengeEntity } from '../../../core/daily-challenge/entities/daily-challenge.entity';

export class DailyChallengeResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'CLASSIC', enum: Mode })
  mode: Mode;

  @ApiProperty({ example: 'splash/Aatrox_0.jpg', required: false })
  imagePath?: string;

  @ApiProperty({ example: [1, 2, 3, 4], required: false })
  matcherChampions?: number[];

  constructor(entity: DailyChallengeEntity) {
    this.id = entity.id;
    this.mode = entity.mode;
    this.imagePath = entity.imagePath;
    this.matcherChampions = entity.matcherChampions;
  }
}
