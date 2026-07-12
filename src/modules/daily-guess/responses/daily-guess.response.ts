// src/modules/daily-guess/responses/daily-guess.response.ts

import { ApiProperty } from '@nestjs/swagger';
import { DailyGuessEntity } from '../../../core/daily-guess/entities/daily-guess.entity';

export class DailyGuessResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 0 })
  guessCount: number;

  @ApiProperty({ example: 1 })
  championsId: number;

  @ApiProperty({ example: 1 })
  dailyChallengeId: number;

  constructor(entity: DailyGuessEntity) {
    this.id = entity.id;
    this.guessCount = entity.guessCount;
    this.championsId = entity.championsId;
    this.dailyChallengeId = entity.dailyChallengeId;
  }
}
