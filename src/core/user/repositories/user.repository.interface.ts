// src/core/user/repositories/user.repository.interface.ts

import { UserEntity, Role, Rank } from '../entities/user.entity';

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  role: Role;
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
  isActive?: boolean;
  score?: number;
  rank?: Rank;
  streak?: number;
  lastLogin?: Date;
  iconPath?: string;
}

export interface IUserRepository {
  create(data: CreateUserInput): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  update(id: string, data: UpdateUserInput): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
