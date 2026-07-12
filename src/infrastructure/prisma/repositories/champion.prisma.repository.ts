// src/infrastructure/prisma/repositories/champion.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateChampionInput,
  IChampionRepository,
  UpdateChampionInput,
} from '../../../core/champion/repositories/champion.repository.interface';
import { ChampionEntity, ChampionRole, DamageType, Gender, RangeType, Resource } from '../../../core/champion/entities/champion.entity';
import { Champion as PrismaChampion } from '../../../generated/prisma/client';

@Injectable()
export class ChampionPrismaRepository implements IChampionRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Mapping ─────────────────────────────────────────────────

  private toEntity(prismaChampion: PrismaChampion): ChampionEntity {
    return new ChampionEntity({
      id: prismaChampion.id,
      name: prismaChampion.name,
      gender: prismaChampion.gender as Gender,
      role: prismaChampion.role as ChampionRole,
      damageType: prismaChampion.damageType as DamageType,
      resource: prismaChampion.resource as Resource,
      rangeType: prismaChampion.rangeType as RangeType,
      yearRelease: prismaChampion.yearRelease,
      traits: prismaChampion.traits,
      iconPath: prismaChampion.iconPath,
      splashPath: prismaChampion.splashPath,
      hint: prismaChampion.hint,
    });
  }

  // ── CRUD ────────────────────────────────────────────────────

  async create(data: CreateChampionInput): Promise<ChampionEntity> {
    const champion = await this.prisma.client.champion.create({ data });
    return this.toEntity(champion);
  }

  async findAll(): Promise<ChampionEntity[]> {
    const champions = await this.prisma.client.champion.findMany({
      orderBy: { id: 'desc' },
    });
    return champions.map((u) => this.toEntity(u));
  }

  async findById(id: number): Promise<ChampionEntity | null> {
    const champion = await this.prisma.client.champion.findUnique({ where: { id } });
    return champion ? this.toEntity(champion) : null;
  }

  async findByName(name: string): Promise<ChampionEntity | null> {
    const champion = await this.prisma.client.champion.findUnique({ where: { name } });
    return champion ? this.toEntity(champion) : null;
  }

  async update(id: number, data: UpdateChampionInput): Promise<ChampionEntity> {
    const champion = await this.prisma.client.champion.update({ where: { id }, data });
    return this.toEntity(champion);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.client.champion.delete({ where: { id } });
  }
}
