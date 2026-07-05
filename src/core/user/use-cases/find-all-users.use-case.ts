// src/core/user/use-cases/find-all-users.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
import type {
  IUserRepository,
} from '../repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }
}
