// src/modules/user/user.controller.ts

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
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserUseCase } from '../../core/user/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '../../core/user/use-cases/find-all-users.use-case';
import { FindTop500UsersUseCase } from '../../core/user/use-cases/find-top-500-users.use-case';
import { FindUserByIdUseCase } from '../../core/user/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '../../core/user/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../core/user/use-cases/delete-user.use-case';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './responses/user.response';
import { LeaderboardUserResponse } from './responses/leaderboard-user.response';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findTop500UsersUseCase: FindTop500UsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  // ── POST /users ─────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: UserResponse, description: 'User created' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponse> {
    const user = await this.createUserUseCase.execute(dto);
    return new UserResponse(user);
  }

  // ── GET /users ──────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiOkResponse({ type: [UserResponse], description: 'List of users' })
  async findAll(): Promise<UserResponse[]> {
    const users = await this.findAllUsersUseCase.execute();
    return users.map((u) => new UserResponse(u));
  }

  // ── GET /users/leaderboard ──────────────────────────────────────────

  @Get('leaderboard')
  @ApiOperation({ summary: 'Retrieve top 500 users leaderboard' })
  @ApiOkResponse({ type: [LeaderboardUserResponse], description: 'List of top users' })
  async getLeaderboard(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<LeaderboardUserResponse[]> {
    const users = await this.findTop500UsersUseCase.execute(page);
    return users.map((u) => new LeaderboardUserResponse(u));
  }

  // ── GET /users/:id ──────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiOkResponse({ type: UserResponse, description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponse> {
    const user = await this.findUserByIdUseCase.execute(id);
    return new UserResponse(user);
  }

  // ── PATCH /users/:id ────────────────────────────────────────

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ type: UserResponse, description: 'User updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.updateUserUseCase.execute({ id, ...dto });
    return new UserResponse(user);
  }

  // ── DELETE /users/:id ───────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }
}
