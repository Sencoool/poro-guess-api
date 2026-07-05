// src/core/user/entities/user.entity.ts

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UserEntity {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  isActive: boolean;
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
