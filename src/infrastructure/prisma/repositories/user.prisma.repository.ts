// src/infrastructure/prisma/repositories/user.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateUserInput,
  IUserRepository,
  UpdateUserInput,
} from '../../../core/user/repositories/user.repository.interface';
import { UserEntity, Role, Rank } from '../../../core/user/entities/user.entity';
import { User as PrismaUser } from '../../../generated/prisma/client';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Mapping ─────────────────────────────────────────────────

  private toEntity(prismaUser: PrismaUser): UserEntity {
    return new UserEntity({
      id: prismaUser.id,
      email: prismaUser.email || undefined,
      username: prismaUser.username,
      password: prismaUser.password || undefined,
      role: prismaUser.role as Role,
      isGuest: prismaUser.isGuest,
      isActive: prismaUser.isActive,
      score: prismaUser.score,
      rank: prismaUser.rank as Rank,
      streak: prismaUser.streak,
      lastLogin: prismaUser.lastLogin,
      iconPath: prismaUser.iconPath,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  // ── CRUD ────────────────────────────────────────────────────

  async create(data: CreateUserInput): Promise<UserEntity> {
    const user = await this.prisma.client.user.create({ data });
    return this.toEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.client.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => this.toEntity(u));
  }

  async findTop500Users(page: number = 1): Promise<UserEntity[]> {
    const limit = 50;
    const skip = (page - 1) * limit;

    if (skip >= 500) {
      return [];
    }

    const take = Math.min(limit, 500 - skip);

    const users = await this.prisma.client.user.findMany({
      orderBy: { score: 'desc' },
      skip,
      take,
    });
    return users.map((u) => this.toEntity(u));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.client.user.findUnique({ where: { id } });
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    return user ? this.toEntity(user) : null;
  }

  async update(id: string, data: UpdateUserInput): Promise<UserEntity> {
    const user = await this.prisma.client.user.update({ where: { id }, data });
    return this.toEntity(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.user.delete({ where: { id } });
  }

  async deleteInactiveGuestUsers(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.prisma.client.user.deleteMany({
      where: {
        isGuest: true,
        lastLogin: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}
