// src/core/champion/use-cases/delete-champion.use-case.ts

import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CHAMPION_REPOSITORY } from "../repositories/champion.repository.interface";
import type { IChampionRepository } from "../repositories/champion.repository.interface";

@Injectable()
export class DeleteChampionUseCase {
  constructor(
    @Inject(CHAMPION_REPOSITORY)
    private readonly championRepository: IChampionRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const champion = await this.championRepository.findById(id);
    if (!champion) {
      throw new NotFoundException(`Champion with id "${id}" not found`);
    }

    await this.championRepository.delete(id);
  }
}