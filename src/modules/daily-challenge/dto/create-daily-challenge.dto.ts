// src/modules/daily-challenge/dto/create-daily-challenge.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Mode } from '../../../core/daily-challenge/entities/daily-challenge.entity';

export class CreateDailyChallengeDto {
  @ApiProperty({
    example: 'CLASSIC',
    description: 'Mode of the daily challenge',
    enum: Mode,
  })
  @IsEnum(Mode)
  mode: Mode;

  @ApiProperty({
    example: 1,
    description: 'The id of the champion',
  })
  @IsNumber()
  championsId: number;
}
