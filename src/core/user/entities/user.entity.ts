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
  email: string;
  username: string;
  password: string;
  role: Role;
  isActive: boolean;
  streak: number;
  lastLogin: Date;
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
}
