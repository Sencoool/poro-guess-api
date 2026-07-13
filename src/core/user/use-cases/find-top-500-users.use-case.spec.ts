import { FindTop500UsersUseCase } from './find-top-500-users.use-case';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

describe('FindTop500UsersUseCase', () => {
  let useCase: FindTop500UsersUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
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

    useCase = new FindTop500UsersUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    // 1. Happy Path
    it('should return paginated top users for a valid page', async () => {
      // Arrange
      const users = [
        new UserEntity({ id: 'user-1', score: 100 }),
      ];
      mockUserRepository.findTop500Users.mockResolvedValue(users);

      // Act
      const result = await useCase.execute(1); // Page 1

      // Assert
      expect(mockUserRepository.findTop500Users).toHaveBeenCalledWith(1);
      expect(result).toEqual(users);
    });

    it('should use default page 1 if page parameter is not provided', async () => {
      // Arrange
      mockUserRepository.findTop500Users.mockResolvedValue([]);

      // Act
      await useCase.execute();

      // Assert
      expect(mockUserRepository.findTop500Users).toHaveBeenCalledWith(1);
    });

    // 2. Unhappy Path
    it('should return empty array if page exceeds limits (e.g. page > 10)', async () => {
      // Arrange
      // In a real scenario, the repository handles returning empty, 
      // but we verify the use-case accurately passes the params and returns the repo's result.
      mockUserRepository.findTop500Users.mockResolvedValue([]);

      // Act
      const result = await useCase.execute(11);

      // Assert
      expect(mockUserRepository.findTop500Users).toHaveBeenCalledWith(11);
      expect(result).toEqual([]);
    });

    // 3. Edge Case
    it('should pass negative or invalid pages down, expecting repository/controller validation to handle it', async () => {
      // Arrange
      mockUserRepository.findTop500Users.mockResolvedValue([]);

      // Act
      await useCase.execute(-5);

      // Assert
      expect(mockUserRepository.findTop500Users).toHaveBeenCalledWith(-5);
    });
  });
});
