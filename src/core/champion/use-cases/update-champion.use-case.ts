// src/core/champion/use-cases/update-champion.use-case.ts

import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CHAMPION_REPOSITORY } from "../repositories/champion.repository.interface";
import type { IChampionRepository, UpdateChampionInput } from "../repositories/champion.repository.interface";
import type { ChampionEntity, ChampionRole, DamageType, Gender, RangeType, Resource } from "../entities/champion.entity";


export interface UpdateChampionCommand {
  id: number;
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

@Injectable()
export class UpdateChampionUseCase{
    constructor(@Inject(CHAMPION_REPOSITORY) private readonly championRepository: IChampionRepository) 
    {}

    async execute(command: UpdateChampionCommand): Promise<ChampionEntity> {
        const champion = await this.championRepository.findById(command.id);
        if(!champion){
            throw new NotFoundException(`Champion with id "${command.id}" not found`);
        }
        const updateData: UpdateChampionInput = {};
        if (command.name !== undefined) updateData.name = command.name;
        if (command.gender !== undefined) updateData.gender = command.gender;
        if (command.role !== undefined) updateData.role = command.role;
        if (command.damageType !== undefined) updateData.damageType = command.damageType;
        if (command.resource !== undefined) updateData.resource = command.resource;
        if (command.rangeType !== undefined) updateData.rangeType = command.rangeType;
        if (command.yearRelease !== undefined) updateData.yearRelease = command.yearRelease;
        if (command.traits !== undefined) updateData.traits = command.traits;
        if (command.iconPath !== undefined) updateData.iconPath = command.iconPath;
        if (command.splashPath !== undefined) updateData.splashPath = command.splashPath;
        if (command.hint !== undefined) updateData.hint = command.hint;
        
        return await this.championRepository.update(command.id, updateData);
    }
}