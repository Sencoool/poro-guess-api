// src/core/user/use-cases/create-user.use-case.ts

import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
import type {
  IUserRepository,
} from '../repositories/user.repository.interface';
import { UserEntity, Role, Rank } from '../entities/user.entity';

export interface CreateUserCommand {
  email: string;
  username: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new ConflictException(
        `User with email "${command.email}" already exists`,
      );
    }

    const hashedPassword = await bcrypt.hash(command.password, 10);

    return this.userRepository.create({
      email: command.email,
      username: command.username,
      password: hashedPassword,
      role: Role.USER,
      isGuest: false,
      isActive: true,
      score: 0,
      rank: Rank.IRON,
      streak: 0,
      lastLogin: new Date(),
      iconPath: 'https://raw.githubusercontent.com/DotA2-Fans/Icons/main/summoners_rift/icons/poro.png',
    });
  }
}
