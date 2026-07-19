// src/modules/user/dto/update-user.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsDateString,
} from 'class-validator';
import { Rank, Role } from 'src/core/user/entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'newemail@example.com',
    description: 'New email address',
  })
  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    example: 'new_username',
    description: 'New username (3–30 alphanumeric characters)',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username may only contain letters, numbers and underscores',
  })
  username?: string;

  @ApiPropertyOptional({
    example: 'NewStr0ng!Pass',
    description: 'New password (min 8 characters)',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password?: string;

  @ApiPropertyOptional({
    example: 'USER',
    description: 'Role of the user',
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    example: true,
    description: 'Activate or deactivate the account',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 0,
    description: 'Score of the user',
  })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiPropertyOptional({
    example: 'IRON',
    description: 'Rank of the user',
    enum: Rank,
  })
  @IsOptional()
  @IsEnum(Rank)
  rank?: Rank;

  @ApiPropertyOptional({
    example: 0,
    description: 'Streak of the user',
  })
  @IsOptional()
  @IsNumber()
  streak?: number;

  @ApiPropertyOptional({
    example: '2022-01-01',
    description: 'Last login of the user',
  })
  @IsOptional()
  @IsDateString()
  lastLogin?: Date;

  @ApiPropertyOptional({
    example: 'path/to/icon.png',
    description: 'Path to the user icon',
  })
  @IsOptional()
  @IsString()
  iconPath?: string;
}
