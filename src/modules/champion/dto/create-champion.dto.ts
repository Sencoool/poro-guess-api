// src/modules/champion/dto/create-champion.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ChampionRole, DamageType, Gender, RangeType, Resource } from 'src/core/champion/entities/champion.entity';

export class CreateChampionDto {
  @ApiProperty({
    example: 'Aatrox',
    description: 'Unique name of the champion',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'MALE',
    description: 'Gender of the champion',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    example: 'TOP',
    description: 'Role of the champion',
    enum: ChampionRole,
  })
  @IsEnum(ChampionRole)
  role: ChampionRole;

  @ApiProperty({
    example: 'PHYSICAL',
    description: 'Damage type of the champion',
    enum: DamageType,
  })
  @IsEnum(DamageType)
  damageType: DamageType;

  @ApiProperty({
    example: 'MANA',
    description: 'Resource of the champion',
    enum: Resource,
  })
  @IsEnum(Resource)
  resource: Resource;

  @ApiProperty({
    example: 'RANGE',
    description: 'Range type of the champion',
    enum: RangeType,
  })
  @IsEnum(RangeType)
  rangeType: RangeType;

  @ApiProperty({
    example: 2014,
    description: 'Year of release',
  })
  @IsNumber()
  yearRelease: number;

  @ApiProperty({
    example: ['This characters is a Darkin', 'Has a skill name the same as alias'],
    description: 'Traits of the champion',
  })
  @IsArray()
  @IsString({ each: true })
  traits: string[];

  @ApiProperty({
    example: '/img/champion/Aatrox.png',
    description: 'Icon path of the champion',
  })
  @IsString()
  iconPath: string;

  @ApiProperty({
    example: ['/img/champion/Aatrox/splash1.png', '/img/champion/Aatrox/splash2.png'],
    description: 'List of splash paths of the champion',
  })
  @IsArray()
  @IsString({ each: true })
  splashPath: string[];

  @ApiProperty({
    example: 'This is a hint for Aatrox',
    description: 'Hint for the champion',
  })
  @IsString()
  hint: string;
}
