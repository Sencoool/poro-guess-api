import { FindAllUsersUseCase } from './find-all-users.use-case';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase;
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
    };

    useCase = new FindAllUsersUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    // 1. Happy Path
    it('should return an array of users', async () => {
      // Arrange
      const users = [
        new UserEntity({ id: 'user-1' }),
        new UserEntity({ id: 'user-2' }),
      ];
      mockUserRepository.findAll.mockResolvedValue(users);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
      expect(result.length).toBe(2);
    });

    // 2. Unhappy Path (Technically fetching all when empty is fine, but we verify it returns [])
    it('should return an empty array if no users exist', async () => {
      // Arrange
      mockUserRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
    });

    // 3. Edge Case
    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockUserRepository.findAll.mockRejectedValue(new Error('DB Timeout'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('DB Timeout');
    });
  });
});
