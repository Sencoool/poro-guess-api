// src/core/user/use-cases/create-guest-user.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import {
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
import type {
  IUserRepository,
} from '../repositories/user.repository.interface';
import { UserEntity, Role, Rank } from '../entities/user.entity';

@Injectable()
export class CreateGuestUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserEntity> {
    const randomSuffix = randomBytes(3).toString('hex').toUpperCase(); // e.g., '1A2B3C'
    const guestUsername = `Guest_${randomSuffix}`;

    return this.userRepository.create({
      username: guestUsername,
      role: Role.USER,
      isGuest: true,
      isActive: true,
      score: 0,
      rank: Rank.IRON,
      streak: 0,
      lastLogin: new Date(),
      iconPath: 'https://raw.githubusercontent.com/DotA2-Fans/Icons/main/summoners_rift/icons/poro.png',
    });
  }
}
