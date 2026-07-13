import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class MakeGuessDto {
  @ApiProperty({ example: 10, required: false, description: 'The ID of the champion being guessed' })
  @IsOptional()
  @IsNumber()
  championId?: number;

  @ApiProperty({ example: 12, required: false, description: 'Total number of moves made (for MATCHER mode)' })
  @IsOptional()
  @IsNumber()
  moves?: number;

  @ApiProperty({ example: 45, required: false, description: 'Time elapsed in seconds (for MATCHER mode)' })
  @IsOptional()
  @IsNumber()
  timeElapsed?: number;

  @ApiProperty({ example: true, required: false, description: 'Whether the challenge is completed/won' })
  @IsOptional()
  @IsBoolean()
  isWon?: boolean;
}
