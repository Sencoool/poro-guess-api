// src/modules/champion/dto/Update-champion.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ChampionRole, DamageType, Gender, RangeType, Resource } from 'src/core/champion/entities/champion.entity';

export class UpdateChampionDto {
  @ApiProperty({
    example: 'Aatrox',
    description: 'Unique name of the champion',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'MALE',
    description: 'Gender of the champion',
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    example: 'TOP',
    description: 'Role of the champion',
    enum: ChampionRole,
  })
  @IsEnum(ChampionRole)
  @IsOptional()
  role?: ChampionRole;

  @ApiProperty({
    example: 'PHYSICAL',
    description: 'Damage type of the champion',
    enum: DamageType,
  })
  @IsEnum(DamageType)
  @IsOptional()
  damageType?: DamageType;

  @ApiProperty({
    example: 'MANA',
    description: 'Resource of the champion',
    enum: Resource,
  })
  @IsEnum(Resource)
  @IsOptional()
  resource?: Resource;

  @ApiProperty({
    example: 'RANGE',
    description: 'Range type of the champion',
    enum: RangeType,
  })
  @IsEnum(RangeType)
  @IsOptional()
  rangeType?: RangeType;

  @ApiProperty({
    example: 2014,
    description: 'Year of release',
  })
  @IsNumber()
  @IsOptional()
  yearRelease?: number;

  @ApiProperty({
    example: ['This characters is a Darkin', 'Has a skill name the same as alias'],
    description: 'Traits of the champion',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  traits?: string[];

  @ApiProperty({
    example: '/img/champion/Aatrox.png',
    description: 'Icon path of the champion',
  })
  @IsString()
  @IsOptional()
  iconPath?: string;

  @ApiProperty({
    example: ['/img/champion/Aatrox/splash1.png', '/img/champion/Aatrox/splash2.png'],
    description: 'List of splash paths of the champion',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  splashPath?: string[];

  @ApiProperty({
    example: 'This is a hint for Aatrox',
    description: 'Hint for the champion',
  })
  @IsString()
  @IsOptional()
  hint?: string;
}
