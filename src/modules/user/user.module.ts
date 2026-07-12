// src/modules/user/user.module.ts

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

import { CreateUserUseCase } from '../../core/user/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '../../core/user/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '../../core/user/use-cases/find-user-by-id.use-case';
import { FindTop500UsersUseCase } from '../../core/user/use-cases/find-top-500-users.use-case';
import { UpdateUserUseCase } from '../../core/user/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../core/user/use-cases/delete-user.use-case';

import { UserPrismaRepository } from '../../infrastructure/prisma/repositories/user.prisma.repository';
import { USER_REPOSITORY } from '../../core/user/repositories/user.repository.interface';

@Module({
  controllers: [UserController],
  providers: [
    // Bind the interface token to the concrete Prisma implementation
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    // Use-cases
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindTop500UsersUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
