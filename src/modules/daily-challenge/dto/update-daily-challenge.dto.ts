// src/modules/daily-challenge/dto/update-daily-challenge.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Mode } from '../../../core/daily-challenge/entities/daily-challenge.entity';

export class UpdateDailyChallengeDto {
  @ApiPropertyOptional({
    example: 'CLASSIC',
    description: 'Mode of the daily challenge',
    enum: Mode,
  })
  @IsOptional()
  @IsEnum(Mode)
  mode?: Mode;

  @ApiPropertyOptional({
    example: 1,
    description: 'The id of the champion',
  })
  @IsOptional()
  @IsNumber()
  championsId?: number;
}
