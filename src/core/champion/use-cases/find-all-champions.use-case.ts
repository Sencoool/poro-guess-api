// src/core/champion/use-cases/find-all-champions.use-case.ts

import { Inject, Injectable } from "@nestjs/common";
import { CHAMPION_REPOSITORY } from "../repositories/champion.repository.interface";
import type { IChampionRepository } from "../repositories/champion.repository.interface";
import { ChampionEntity } from "../entities/champion.entity";

@Injectable()
export class FindAllChampionsUseCase{
    constructor(@Inject(CHAMPION_REPOSITORY) private readonly championRepository: IChampionRepository)
    {}
    
    async execute(): Promise<ChampionEntity[]> {
        return this.championRepository.findAll();
    }
}