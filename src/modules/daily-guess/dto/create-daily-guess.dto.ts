// src/modules/daily-guess/dto/create-daily-guess.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateDailyGuessDto {
  @ApiPropertyOptional({
    example: 0,
    description: 'The number of guesses made',
  })
  @IsOptional()
  @IsNumber()
  guessCount?: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the champion',
  })
  @IsNumber()
  championsId: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the daily challenge',
  })
  @IsNumber()
  dailyChallengeId: number;
}
