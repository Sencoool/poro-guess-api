// src/modules/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Rank, Role } from 'src/core/user/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Unique email address of the user',
  })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username (3–30 alphanumeric characters)',
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username may only contain letters, numbers and underscores',
  })
  username: string;

  @ApiProperty({
    example: 'Str0ng!Pass',
    description: 'Password (min 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password: string;

  @ApiProperty({
    example: 'USER',
    description: 'Role of the user',
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    example: true,
    description: 'Activate or deactivate the account',
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: 0,
    description: 'Score of the user',
  })
  @IsNumber()
  score: number;

  @ApiProperty({
    example: 'IRON',
    description: 'Rank of the user',
    enum: Rank,
  })
  @IsEnum(Rank)
  rank: Rank;

  @ApiProperty({
    example: 0,
    description: 'Streak of the user',
  })
  @IsNumber()
  streak: number;

  @ApiProperty({
    example: '2022-01-01',
    description: 'Last login of the user',
  })
  @IsDateString()
  lastLogin: Date;

  @ApiProperty({
    example: 'path/to/icon.png',
    description: 'Path to the user icon',
  })
  @IsString()
  iconPath: string;
}
