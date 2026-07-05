// src/modules/user/dto/update-user.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

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
    example: true,
    description: 'Activate or deactivate the account',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
