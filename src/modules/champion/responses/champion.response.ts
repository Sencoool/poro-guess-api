// src/modules/champion/responses/champion.response.ts

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ChampionRole, DamageType, Gender, RangeType, Resource } from 'src/core/champion/entities/champion.entity';

@Exclude()
export class ChampionResponse {
  @Expose()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Aatrox' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'MALE' })
  gender: Gender;

  @Expose()
  @ApiProperty({ example: 'TOP' })
  role: ChampionRole;

  @Expose()
  @ApiProperty({ example: 'PHYSICAL' })
  damageType: DamageType;

  @Expose()
  @ApiProperty({ example: 'MANA' })
  resource: Resource;

  @Expose()
  @ApiProperty({ example: 'RANGE' })
  rangeType: RangeType;

  @Expose()
  @ApiProperty({ example: 2014 })
  yearRelease: number;

  @Expose()
  @ApiProperty({ example: ['This characters is a Darkin', 'Has a skill name the same as alias'] })
  traits: string[];

  @Expose()
  @ApiProperty({ example: '/img/champion/Aatrox.png' })
  iconPath: string;

  @Expose()
  @ApiProperty({ example: ['/img/champion/Aatrox/splash1.png', '/img/champion/Aatrox/splash2.png'] })
  splashPath: string[];

  @Expose()
  @ApiProperty({ example: 'This is a hint for Aatrox' })
  hint: string;

  
  constructor(partial: Partial<ChampionResponse>) {
    Object.assign(this, partial);
  }
}
