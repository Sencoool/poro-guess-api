// src/core/user/use-cases/update-user.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
import type {
  IUserRepository,
  UpdateUserInput,
} from '../repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

export interface UpdateUserCommand {
  id: string;
  email?: string;
  username?: string;
  password?: string;
  isActive?: boolean;
  streak?: number;
  lastLogin?: Date;
  iconPath?: string;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new NotFoundException(`User with id "${command.id}" not found`);
    }

    const updateData: UpdateUserInput = {};
    if (command.email !== undefined) updateData.email = command.email;
    if (command.username !== undefined) updateData.username = command.username;
    if (command.isActive !== undefined) updateData.isActive = command.isActive;
    if (command.password !== undefined) {
      updateData.password = await bcrypt.hash(command.password, 10);
    }
    if (command.streak !== undefined) updateData.streak = command.streak;
    if (command.lastLogin !== undefined) updateData.lastLogin = command.lastLogin;
    if (command.iconPath !== undefined) updateData.iconPath = command.iconPath;

    return this.userRepository.update(command.id, updateData);
  }
}
