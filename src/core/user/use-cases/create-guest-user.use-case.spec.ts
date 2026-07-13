import { Test, TestingModule } from '@nestjs/testing';
import { CreateGuestUserUseCase } from './create-guest-user.use-case';
import { IUserRepository, USER_REPOSITORY } from '../repositories/user.repository.interface';
import { UserEntity, Role, Rank } from '../entities/user.entity';

describe('CreateGuestUserUseCase', () => {
  let useCase: CreateGuestUserUseCase;
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
        CreateGuestUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateGuestUserUseCase>(CreateGuestUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new UserEntity({
    id: 'user-2',
    username: 'Guest_A1B2C3',
    role: Role.USER,
    isGuest: true,
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
    it('should create a new guest user successfully', async () => {
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.execute();

      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        username: expect.stringMatching(/^Guest_[A-F0-9]{6}$/),
        role: Role.USER,
        isGuest: true,
        isActive: true,
        score: 0,
        rank: Rank.IRON,
        streak: 0,
        iconPath: 'https://raw.githubusercontent.com/DotA2-Fans/Icons/main/summoners_rift/icons/poro.png',
      }));
      expect(result).toEqual(mockUser);
    });
  });
});
