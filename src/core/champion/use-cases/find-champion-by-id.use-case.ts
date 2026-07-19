// src/core/champion/use-cases/find-champion-by-id.use-case.ts

import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CHAMPION_REPOSITORY } from "../repositories/champion.repository.interface";
import type { IChampionRepository } from "../repositories/champion.repository.interface";
import type { ChampionEntity } from "../entities/champion.entity";


@Injectable()
export class FindChampionByIdUseCase{
    constructor(@Inject(CHAMPION_REPOSITORY) private readonly championRepository: IChampionRepository) 
    {}

    async execute(id: number): Promise<ChampionEntity> {
        const champion = await this.championRepository.findById(id);
        if(!champion){
            throw new NotFoundException(`Champion with id "${id}" not found`);
        }
        return champion;
    }
}