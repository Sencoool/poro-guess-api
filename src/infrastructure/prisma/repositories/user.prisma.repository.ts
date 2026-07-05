// src/infrastructure/prisma/repositories/user.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateUserInput,
  IUserRepository,
  UpdateUserInput,
} from '../../../core/user/repositories/user.repository.interface';
import { UserEntity, Role } from '../../../core/user/entities/user.entity';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Mapping ─────────────────────────────────────────────────

  private toEntity(prismaUser: PrismaUser): UserEntity {
    return new UserEntity({
      id: prismaUser.id,
      email: prismaUser.email,
      username: prismaUser.username,
      password: prismaUser.password,
      role: prismaUser.role as Role,
      isActive: prismaUser.isActive,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  // ── CRUD ────────────────────────────────────────────────────

  async create(data: CreateUserInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({ data });
    return this.toEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => this.toEntity(u));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toEntity(user) : null;
  }

  async update(id: string, data: UpdateUserInput): Promise<UserEntity> {
    const user = await this.prisma.user.update({ where: { id }, data });
    return this.toEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
