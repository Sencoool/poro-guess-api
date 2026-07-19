import { Injectable, Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
import { UserEntity, Role, Rank } from '../entities/user.entity';
import type { IUserRepository } from '../repositories/user.repository.interface';

export interface OAuthLoginCommand {
  email: string | null;
  firstName: string;
  lastName: string;
  providerId: string;
  provider: string;
}

@Injectable()
export class ValidateOAuthLoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: OAuthLoginCommand): Promise<UserEntity> {
    // 1. Check if user already exists with this providerId
    let user = await this.userRepository.findByProviderId(command.providerId);
    if (user) {
      return user;
    }

    // 2. Check if a user with this email already exists
    if (command.email) {
      user = await this.userRepository.findByEmail(command.email);
    }

    if (user) {
      // Link existing user to this provider
      return this.userRepository.update(user.id, {
        provider: command.provider,
        providerId: command.providerId,
      });
    }

    // 3. Generate a unique username based on email or name
    const baseUsername = command.email
      ? command.email.split('@')[0]
      : `${command.firstName}${command.lastName}`;
    
    let username = baseUsername;
    let counter = 1;
    while (await this.userRepository.findByUsername(username)) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // 4. Create the new user
    return this.userRepository.create({
      email: command.email || undefined,
      username,
      provider: command.provider,
      providerId: command.providerId,
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
