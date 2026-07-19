// src/core/champion/use-cases/create-champion.use-case.ts

import { Inject, Injectable } from "@nestjs/common";
import { CHAMPION_REPOSITORY } from "../repositories/champion.repository.interface";
import type { IChampionRepository } from "../repositories/champion.repository.interface";
import { ChampionEntity, ChampionRole, DamageType, Gender, RangeType, Resource } from "../entities/champion.entity";

export interface CreateChampionCommand {
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

@Injectable()
export class CreateChampionUseCase {
    constructor(
        @Inject(CHAMPION_REPOSITORY)
        private readonly championRepository: IChampionRepository,
    ) {}
    
    async execute(command: CreateChampionCommand): Promise<ChampionEntity> {
       return this.championRepository.create({
        name: command.name,
        gender: command.gender,
        role: command.role,
        damageType: command.damageType,
        resource: command.resource,
        rangeType: command.rangeType,
        yearRelease: command.yearRelease,
        traits: command.traits,
        iconPath: command.iconPath,
        splashPath: command.splashPath,
        hint: command.hint,
       });
    }
}