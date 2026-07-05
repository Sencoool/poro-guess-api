// src/modules/user/dto/create-user.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

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
}
