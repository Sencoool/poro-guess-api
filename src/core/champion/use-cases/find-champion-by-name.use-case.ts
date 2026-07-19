import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CHAMPION_REPOSITORY } from '../repositories/champion.repository.interface';
import type { IChampionRepository } from '../repositories/champion.repository.interface';
import { ChampionEntity } from '../entities/champion.entity';

@Injectable()
export class FindChampionByNameUseCase {
  constructor(
    @Inject(CHAMPION_REPOSITORY)
    private readonly championRepository: IChampionRepository,
  ) {}

  async execute(name: string): Promise<ChampionEntity> {
    const champion = await this.championRepository.findByName(name);
    if (!champion) {
      throw new NotFoundException(`Champion with name "${name}" not found`);
    }
    return champion;
  }
}
