// src/core/user/repositories/champion.repository.interface.ts

import { ChampionEntity, ChampionRole, DamageType, Gender, RangeType, Resource } from '../entities/champion.entity';

export interface CreateChampionInput {
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
}

export interface UpdateChampionInput {
  name?: string;
  gender?: Gender;
  role?: ChampionRole;
  damageType?: DamageType;
  resource?: Resource;
  rangeType?: RangeType;
  yearRelease?: number;
  traits?: string[];
  iconPath?: string;
  splashPath?: string[];
  hint?: string;
}

export interface IChampionRepository {
  create(data: CreateChampionInput): Promise<ChampionEntity>;
  findAll(): Promise<ChampionEntity[]>;
  findById(id: number): Promise<ChampionEntity | null>;
  findByName(name: string): Promise<ChampionEntity | null>;
  update(id: number, data: UpdateChampionInput): Promise<ChampionEntity>;
  delete(id: number): Promise<void>;
}

export const CHAMPION_REPOSITORY = Symbol('IChampionRepository');