// src/modules/user/responses/user.response.ts

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../../core/user/entities/user.entity';

@Exclude()
export class UserResponse {
  @Expose()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'john_doe' })
  username: string;

  @Expose()
  @ApiProperty({ enum: Role, example: Role.USER })
  role: Role;

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty({ example: 120 })
  score: number;

  @Expose()
  @ApiProperty({ example: 'GOLD' })
  rank: string;

  @Expose()
  @ApiProperty({ example: 5 })
  streak: number;

  @Expose()
  @ApiProperty({ example: true })
  isGuest: boolean;

  @Expose()
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  lastLogin: Date;

  @Expose()
  @ApiProperty({ example: 'https://raw.githubusercontent.com/DotA2-Fans/Icons/main/summoners_rift/icons/poro.png' })
  iconPath: string;

  @Expose()
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
