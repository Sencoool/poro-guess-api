// src/modules/champion/champion.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateChampionUseCase } from '../../core/champion/use-cases/create-champion.use-case';
import { FindAllChampionsUseCase } from '../../core/champion/use-cases/find-all-champions.use-case';
import { FindChampionByIdUseCase } from '../../core/champion/use-cases/find-champion-by-id.use-case';
import { UpdateChampionUseCase } from '../../core/champion/use-cases/update-champion.use-case';
import { DeleteChampionUseCase } from '../../core/champion/use-cases/delete-champion.use-case';

import { CreateChampionDto } from './dto/create-champion.dto';
import { UpdateChampionDto } from './dto/update-champion.dto';
import { ChampionResponse } from './responses/champion.response';

@ApiTags('Champions')
@Controller('champions')
export class ChampionController {
  constructor(
    private readonly createChampionUseCase: CreateChampionUseCase,
    private readonly findAllChampionsUseCase: FindAllChampionsUseCase,
    private readonly findChampionByIdUseCase: FindChampionByIdUseCase,
    private readonly updateChampionUseCase: UpdateChampionUseCase,
    private readonly deleteChampionUseCase: DeleteChampionUseCase,
  ) {}

  // ── POST /users ─────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new champion' })
  @ApiCreatedResponse({ type: ChampionResponse, description: 'Champion created' })
  async create(@Body() dto: CreateChampionDto): Promise<ChampionResponse> {
    const champion = await this.createChampionUseCase.execute(dto);
    return new ChampionResponse(champion);
  }

  // ── GET /users ──────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Retrieve all champions' })
  @ApiOkResponse({ type: [ChampionResponse], description: 'List of champions' })
  async findAll(): Promise<ChampionResponse[]> {
    const champions = await this.findAllChampionsUseCase.execute();
    return champions.map((c) => new ChampionResponse(c));
  }

  // ── GET /users/:id ──────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a champion by ID' })
  @ApiOkResponse({ type: ChampionResponse, description: 'Champion found' })
  @ApiNotFoundResponse({ description: 'Champion not found' })
  async findOne(
    @Param('id') id: number,
  ): Promise<ChampionResponse> {
    const champion = await this.findChampionByIdUseCase.execute(id);
    return new ChampionResponse(champion);
  }

  // ── PATCH /users/:id ────────────────────────────────────────

  @Patch(':id')
  @ApiOperation({ summary: 'Update a champion' })
  @ApiOkResponse({ type: ChampionResponse, description: 'Champion updated' })
  @ApiNotFoundResponse({ description: 'Champion not found' })
  async update(
    @Param('id') id: number,
    @Body() dto?: UpdateChampionDto,
  ): Promise<ChampionResponse> {
    const champion = await this.updateChampionUseCase.execute({ id, ...dto });
    return new ChampionResponse(champion);
  }

  // ── DELETE /users/:id ───────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a champion' })
  @ApiNoContentResponse({ description: 'Champion deleted' })
  @ApiNotFoundResponse({ description: 'Champion not found' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.deleteChampionUseCase.execute(id);
  }
}
