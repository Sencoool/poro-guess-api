// src/core/user/repositories/user.repository.interface.ts

import { UserEntity, Role, Rank } from '../entities/user.entity';

export interface CreateUserInput {
  email?: string;
  username: string;
  password?: string;
  provider?: string;
  providerId?: string;
  role: Role;
  isGuest: boolean;
  isActive: boolean;
  score: number;
  rank: Rank;
  streak: number;
  lastLogin: Date;
  iconPath: string;
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
  password?: string;
  provider?: string;
  providerId?: string;
  isActive?: boolean;
  isGuest?: boolean;
  score?: number;
  rank?: Rank;
  streak?: number;
  lastLogin?: Date;
  lastPlayedAt?: Date;
  iconPath?: string;
}

export interface IUserRepository {
  create(data: CreateUserInput): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findTop500Users(page?: number): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findByProviderId(providerId: string): Promise<UserEntity | null>;
  update(id: string, data: UpdateUserInput): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  deleteInactiveGuestUsers(days: number): Promise<number>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
