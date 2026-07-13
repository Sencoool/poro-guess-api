import { ApiProperty } from '@nestjs/swagger';
import { UserDailyProgressEntity } from '../../../core/user-progress/entities/user-progress.entity';
import { ChampionGuessResult } from '../../../core/user-progress/types';

export class UserProgressResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user-123' })
  userId: string;

  @ApiProperty({ example: 1 })
  dailyChallengeId: number;

  @ApiProperty({ type: [Object] })
  guesses: ChampionGuessResult[];

  @ApiProperty({ example: false })
  isWon: boolean;

  @ApiProperty({ example: 15, required: false })
  moves?: number;

  @ApiProperty({ example: 60, required: false })
  timeElapsed?: number;

  @ApiProperty({ required: false })
  hint?: string;

  @ApiProperty({ type: [String], required: false })
  traits?: string[];

  @ApiProperty({ required: false })
  targetChampionId?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    entity: UserDailyProgressEntity,
    guesses: ChampionGuessResult[],
    hint?: string,
    traits?: string[],
    targetChampionId?: number
  ) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.dailyChallengeId = entity.dailyChallengeId;
    this.guesses = guesses;
    this.isWon = entity.isWon;
    this.moves = entity.moves;
    this.timeElapsed = entity.timeElapsed;
    this.hint = hint;
    this.traits = traits;
    this.targetChampionId = targetChampionId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
