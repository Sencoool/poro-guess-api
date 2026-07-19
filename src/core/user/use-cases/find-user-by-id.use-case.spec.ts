import { NotFoundException } from '@nestjs/common';
import { FindUserByIdUseCase } from './find-user-by-id.use-case';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

describe('FindUserByIdUseCase', () => {
  let useCase: FindUserByIdUseCase;
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

    useCase = new FindUserByIdUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    // 1. Happy Path
    it('should return a user if found', async () => {
      // Arrange
      const expectedUser = new UserEntity({ id: 'user-1', username: 'test' });
      mockUserRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await useCase.execute('user-1');

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(expectedUser);
    });

    // 2. Unhappy Path
    it('should throw NotFoundException if user is not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('missing')).rejects.toThrow(NotFoundException);
    });

    // 3. Edge Case
    it('should handle malformed IDs that cause database crashes', async () => {
      // Arrange
      mockUserRepository.findById.mockRejectedValue(new Error('Invalid UUID syntax'));

      // Act & Assert
      await expect(useCase.execute('invalid-uuid-%$#')).rejects.toThrow('Invalid UUID syntax');
    });
  });
});
