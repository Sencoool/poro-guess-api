// src/modules/user/dto/update-user.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
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
    @IsEnum(Role)
    role: Role;
  
    @ApiPropertyOptional({
      example: true,
      description: 'Activate or deactivate the account',
    })
    @IsBoolean()
    isActive: boolean;
  
    @ApiPropertyOptional({
      example: 0,
      description: 'Score of the user',
    })
    @IsNumber()
    score: number;
  
    @ApiPropertyOptional({
      example: 'IRON',
      description: 'Rank of the user',
      enum: Rank,
    })
    @IsEnum(Rank)
    rank: Rank;
  
    @ApiPropertyOptional({
      example: 0,
      description: 'Streak of the user',
    })
    @IsNumber()
    streak: number;
  
    @ApiPropertyOptional({
      example: '2022-01-01',
      description: 'Last login of the user',
    })
    @IsDate()
    lastLogin: Date;
  
    @ApiPropertyOptional({
      example: 'path/to/icon.png',
      description: 'Path to the user icon',
    })
    @IsString()
    iconPath: string;
}
