// src/core/user/use-cases/find-user-by-id.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
import type {
  IUserRepository,
} from '../repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }
}
