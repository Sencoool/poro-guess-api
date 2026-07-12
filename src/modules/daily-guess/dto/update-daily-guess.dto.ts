// src/modules/daily-guess/dto/update-daily-guess.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateDailyGuessDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'The number of guesses made',
  })
  @IsOptional()
  @IsNumber()
  guessCount?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'The id of the champion',
  })
  @IsOptional()
  @IsNumber()
  championsId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'The id of the daily challenge',
  })
  @IsOptional()
  @IsNumber()
  dailyChallengeId?: number;
}
