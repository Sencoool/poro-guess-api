// src/core/user/entities/user.entity.ts

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum Rank {
  IRON = 'IRON',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  EMERALD = 'EMERALD',
  DIAMOND = 'DIAMOND',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER',
  CHALLENGER = 'CHALLENGER',
}

export class UserEntity {
  id: string;
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
  lastPlayedAt?: Date;
  iconPath: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  /**
   * Returns a safe representation of the user without the password field.
   */
  toPublic(): Omit<UserEntity, 'password' | 'toPublic'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, toPublic, ...rest } = this;
    return rest;
  }

  /**
   * Calculate the user's rank based on their total score.
   */
  static calculateRank(score: number): Rank {
    if (score >= 2800) return Rank.CHALLENGER;
    if (score >= 1800) return Rank.GRANDMASTER;
    if (score >= 1200) return Rank.MASTER;
    if (score >= 750) return Rank.DIAMOND;
    if (score >= 450) return Rank.EMERALD;
    if (score >= 250) return Rank.PLATINUM;
    if (score >= 120) return Rank.GOLD;
    if (score >= 50) return Rank.SILVER;
    if (score >= 10) return Rank.BRONZE;
    return Rank.IRON;
  }
}
