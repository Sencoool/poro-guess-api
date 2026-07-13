import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetUserProgressUseCase } from '../../core/user-progress/use-cases/get-user-progress.use-case';
import { MakeGuessUseCase } from '../../core/user-progress/use-cases/make-guess.use-case';

import { MakeGuessDto } from './dto/make-guess.dto';
import { UserProgressResponse } from './responses/user-progress.response';

@ApiTags('UserProgress')
@Controller('user-progress')
export class UserProgressController {
  constructor(
    private readonly getUserProgressUseCase: GetUserProgressUseCase,
    private readonly makeGuessUseCase: MakeGuessUseCase,
  ) {}

  @Get(':userId/:dailyChallengeId')
  @ApiOperation({ summary: 'Retrieve user progress for a challenge' })
  @ApiOkResponse({ type: UserProgressResponse, description: 'User progress found' })
  async findOne(
    @Param('userId') userId: string,
    @Param('dailyChallengeId', ParseIntPipe) dailyChallengeId: number,
  ): Promise<UserProgressResponse> {
    const progress = await this.getUserProgressUseCase.execute(userId, dailyChallengeId);
    return new UserProgressResponse(progress);
  }

  @Post(':userId/:dailyChallengeId/guess')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Make a guess for a daily challenge' })
  @ApiOkResponse({ type: UserProgressResponse, description: 'Guess successfully made' })
  async makeGuess(
    @Param('userId') userId: string,
    @Param('dailyChallengeId', ParseIntPipe) dailyChallengeId: number,
    @Body() dto: MakeGuessDto,
  ): Promise<UserProgressResponse> {
    const progress = await this.makeGuessUseCase.execute({
      userId,
      dailyChallengeId,
      championId: dto.championId,
      moves: dto.moves,
      timeElapsed: dto.timeElapsed,
      isWon: dto.isWon,
    });
    return new UserProgressResponse(progress);
  }
}
