// src/modules/champion/champion.module.ts

import { Module } from '@nestjs/common';
import { ChampionController } from './champion.controller';

import { CreateChampionUseCase } from '../../core/champion/use-cases/create-champion.use-case';
import { FindAllChampionsUseCase } from '../../core/champion/use-cases/find-all-champions.use-case';
import { FindChampionByIdUseCase } from '../../core/champion/use-cases/find-champion-by-id.use-case';
import { UpdateChampionUseCase } from '../../core/champion/use-cases/update-champion.use-case';
import { DeleteChampionUseCase } from '../../core/champion/use-cases/delete-champion.use-case';

import { ChampionPrismaRepository } from '../../infrastructure/prisma/repositories/champion.prisma.repository';
import { CHAMPION_REPOSITORY } from '../../core/champion/repositories/champion.repository.interface';

@Module({
  controllers: [ChampionController],
  providers: [
    // Bind the interface token to the concrete Prisma implementation
    {
      provide: CHAMPION_REPOSITORY,
      useClass: ChampionPrismaRepository,
    },
    // Use-cases
    CreateChampionUseCase,
    FindAllChampionsUseCase,
    FindChampionByIdUseCase,
    UpdateChampionUseCase,
    DeleteChampionUseCase,
  ],
})
export class ChampionModule {}
