import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { IUserRepository, USER_REPOSITORY } from '../repositories/user.repository.interface';
import { UserEntity, Role, Rank } from '../entities/user.entity';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
}));

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findTop500Users: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteInactiveGuestUsers: jest.fn(),
      findByUsername: jest.fn(),
      findByProviderId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new UserEntity({
    id: 'user-1',
    username: 'player',
    email: 'player@test.com',
    password: 'hashedPassword123',
    role: Role.USER,
    isGuest: false,
    isActive: true,
    score: 0,
    rank: Rank.IRON,
    streak: 0,
    lastLogin: new Date(),
    iconPath: 'https://raw.githubusercontent.com/DotA2-Fans/Icons/main/summoners_rift/icons/poro.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  describe('execute', () => {
    it('should create a new user successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const command = { email: 'player@test.com', username: 'player', password: 'password123' };
      const result = await useCase.execute(command);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('player@test.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'player@test.com',
        username: 'player',
        password: 'hashedPassword123',
        role: Role.USER,
        isGuest: false,
        isActive: true,
        score: 0,
        rank: Rank.IRON,
        streak: 0,
        iconPath: 'https://raw.githubusercontent.com/DotA2-Fans/Icons/main/summoners_rift/icons/poro.png',
      }));
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const command = { email: 'player@test.com', username: 'player2', password: 'password123' };

      await expect(useCase.execute(command)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('player@test.com');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
