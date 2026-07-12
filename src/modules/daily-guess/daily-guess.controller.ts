// src/modules/daily-guess/daily-guess.controller.ts

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

import { CreateDailyGuessUseCase } from '../../core/daily-guess/use-cases/create-daily-guess.use-case';
import { FindAllDailyGuessesUseCase } from '../../core/daily-guess/use-cases/find-all-daily-guesses.use-case';
import { FindDailyGuessByIdUseCase } from '../../core/daily-guess/use-cases/find-daily-guess-by-id.use-case';
import { UpdateDailyGuessUseCase } from '../../core/daily-guess/use-cases/update-daily-guess.use-case';
import { DeleteDailyGuessUseCase } from '../../core/daily-guess/use-cases/delete-daily-guess.use-case';

import { CreateDailyGuessDto } from './dto/create-daily-guess.dto';
import { UpdateDailyGuessDto } from './dto/update-daily-guess.dto';
import { DailyGuessResponse } from './responses/daily-guess.response';

@ApiTags('DailyGuesses')
@Controller('daily-guesses')
export class DailyGuessController {
  constructor(
    private readonly createDailyGuessUseCase: CreateDailyGuessUseCase,
    private readonly findAllDailyGuessesUseCase: FindAllDailyGuessesUseCase,
    private readonly findDailyGuessByIdUseCase: FindDailyGuessByIdUseCase,
    private readonly updateDailyGuessUseCase: UpdateDailyGuessUseCase,
    private readonly deleteDailyGuessUseCase: DeleteDailyGuessUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new daily guess' })
  @ApiCreatedResponse({ type: DailyGuessResponse, description: 'Daily guess created' })
  async create(@Body() dto: CreateDailyGuessDto): Promise<DailyGuessResponse> {
    const dailyGuess = await this.createDailyGuessUseCase.execute(dto);
    return new DailyGuessResponse(dailyGuess);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all daily guesses' })
  @ApiOkResponse({ type: [DailyGuessResponse], description: 'List of daily guesses' })
  async findAll(): Promise<DailyGuessResponse[]> {
    const dailyGuesses = await this.findAllDailyGuessesUseCase.execute();
    return dailyGuesses.map((g) => new DailyGuessResponse(g));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a daily guess by ID' })
  @ApiOkResponse({ type: DailyGuessResponse, description: 'Daily guess found' })
  @ApiNotFoundResponse({ description: 'Daily guess not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DailyGuessResponse> {
    const dailyGuess = await this.findDailyGuessByIdUseCase.execute(id);
    return new DailyGuessResponse(dailyGuess);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a daily guess' })
  @ApiOkResponse({ type: DailyGuessResponse, description: 'Daily guess updated' })
  @ApiNotFoundResponse({ description: 'Daily guess not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDailyGuessDto,
  ): Promise<DailyGuessResponse> {
    const dailyGuess = await this.updateDailyGuessUseCase.execute({ id, ...dto });
    return new DailyGuessResponse(dailyGuess);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a daily guess' })
  @ApiNoContentResponse({ description: 'Daily guess deleted' })
  @ApiNotFoundResponse({ description: 'Daily guess not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteDailyGuessUseCase.execute(id);
  }
}
