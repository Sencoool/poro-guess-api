import { ApiProperty } from '@nestjs/swagger';
import { UserDailyProgressEntity } from '../../../core/user-progress/entities/user-progress.entity';

export class UserProgressResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user-123' })
  userId: string;

  @ApiProperty({ example: 1 })
  dailyChallengeId: number;

  @ApiProperty({ example: [1, 5, 10], type: [Number] })
  guessedChampions: number[];

  @ApiProperty({ example: false })
  isWon: boolean;

  @ApiProperty({ example: 15, required: false })
  moves?: number;

  @ApiProperty({ example: 60, required: false })
  timeElapsed?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: UserDailyProgressEntity) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.dailyChallengeId = entity.dailyChallengeId;
    this.guessedChampions = entity.guessedChampions;
    this.isWon = entity.isWon;
    this.moves = entity.moves;
    this.timeElapsed = entity.timeElapsed;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
