// src/modules/user/responses/leaderboard-user.response.ts

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Rank, UserEntity } from '../../../core/user/entities/user.entity';

@Exclude()
export class LeaderboardUserResponse {
  @Expose()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @Expose()
  @ApiProperty({ enum: Rank, example: Rank.IRON })
  rank: Rank;

  @Expose()
  @ApiProperty({ example: 1200 })
  score: number;

  @Expose()
  @ApiProperty({ example: 5 })
  streak: number;

  @Expose()
  @ApiProperty({ example: 'https://raw.githubusercontent.com/DotA2-Fans/Icons/main/summoners_rift/icons/poro.png' })
  iconPath: string;

  constructor(user: UserEntity) {
    Object.assign(this, {
      id: user.id,
      username: user.username,
      rank: user.rank,
      score: user.score,
      streak: user.streak,
      iconPath: user.iconPath,
    });
  }
}
