// src/modules/daily-challenge/daily-challenge.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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

import { CreateDailyChallengeUseCase } from '../../core/daily-challenge/use-cases/create-daily-challenge.use-case';
import { FindAllDailyChallengesUseCase } from '../../core/daily-challenge/use-cases/find-all-daily-challenges.use-case';
import { FindDailyChallengeByIdUseCase } from '../../core/daily-challenge/use-cases/find-daily-challenge-by-id.use-case';
import { UpdateDailyChallengeUseCase } from '../../core/daily-challenge/use-cases/update-daily-challenge.use-case';
import { DeleteDailyChallengeUseCase } from '../../core/daily-challenge/use-cases/delete-daily-challenge.use-case';

import { CreateDailyChallengeDto } from './dto/create-daily-challenge.dto';
import { UpdateDailyChallengeDto } from './dto/update-daily-challenge.dto';
import { DailyChallengeResponse } from './responses/daily-challenge.response';

@ApiTags('DailyChallenges')
@Controller('daily-challenges')
export class DailyChallengeController {
  constructor(
    private readonly createDailyChallengeUseCase: CreateDailyChallengeUseCase,
    private readonly findAllDailyChallengesUseCase: FindAllDailyChallengesUseCase,
    private readonly findDailyChallengeByIdUseCase: FindDailyChallengeByIdUseCase,
    private readonly updateDailyChallengeUseCase: UpdateDailyChallengeUseCase,
    private readonly deleteDailyChallengeUseCase: DeleteDailyChallengeUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new daily challenge' })
  @ApiCreatedResponse({ type: DailyChallengeResponse, description: 'Daily challenge created' })
  async create(@Body() dto: CreateDailyChallengeDto): Promise<DailyChallengeResponse> {
    const dailyChallenge = await this.createDailyChallengeUseCase.execute(dto);
    return new DailyChallengeResponse(dailyChallenge);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all daily challenges' })
  @ApiOkResponse({ type: [DailyChallengeResponse], description: 'List of daily challenges' })
  async findAll(): Promise<DailyChallengeResponse[]> {
    const dailyChallenges = await this.findAllDailyChallengesUseCase.execute();
    return dailyChallenges.map((c) => new DailyChallengeResponse(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a daily challenge by ID' })
  @ApiOkResponse({ type: DailyChallengeResponse, description: 'Daily challenge found' })
  @ApiNotFoundResponse({ description: 'Daily challenge not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DailyChallengeResponse> {
    const dailyChallenge = await this.findDailyChallengeByIdUseCase.execute(id);
    return new DailyChallengeResponse(dailyChallenge);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a daily challenge' })
  @ApiOkResponse({ type: DailyChallengeResponse, description: 'Daily challenge updated' })
  @ApiNotFoundResponse({ description: 'Daily challenge not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDailyChallengeDto,
  ): Promise<DailyChallengeResponse> {
    const dailyChallenge = await this.updateDailyChallengeUseCase.execute({ id, ...dto });
    return new DailyChallengeResponse(dailyChallenge);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a daily challenge' })
  @ApiNoContentResponse({ description: 'Daily challenge deleted' })
  @ApiNotFoundResponse({ description: 'Daily challenge not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteDailyChallengeUseCase.execute(id);
  }
}
