// src/core/user/entities/champion.entity.ts

export enum ChampionRole {
  TOP = 'TOP',
  JUNGLE = 'JUNGLE',
  MID = 'MID',
  BOT =  'BOT',
  SUPPORT = 'SUPPORT'
}

export enum DamageType {
  PHYSICAL = 'PHYSICAL',
  MAGICAL = 'MAGICAL'
}

export enum Resource {
  MANA = 'MANA',
  MANALESS = 'MANALESS',
  ENERGY = 'ENERGY',
  RAGE = 'RAGE',
  NONE = 'NONE'
}

export enum RangeType {
  MELEE = 'MELEE',
  RANGE = 'RANGE'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export class ChampionEntity {
  id: number;
  name: string;
  gender: Gender;
  role: ChampionRole;
  damageType: DamageType;
  resource: Resource;
  rangeType: RangeType;
  yearRelease: number;
  traits: string[];
  iconPath: string;
  splashPath: string[];
  hint: string;

  constructor(partial: Partial<ChampionEntity>) {
    Object.assign(this, partial);
  }

  /**
   * Returns a safe representation of the champion without the password field.
   */
  toPublic(): Omit<ChampionEntity, 'toPublic'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { toPublic, ...rest } = this;
    return rest;
  }
}
