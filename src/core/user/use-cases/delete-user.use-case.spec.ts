import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from './delete-user.use-case';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
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

    useCase = new DeleteUserUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    // 1. Happy Path
    it('should delete a user successfully', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: 'user-1' });
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute('user-1');

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-1');
      expect(mockUserRepository.delete).toHaveBeenCalledWith('user-1');
    });

    // 2. Unhappy Path
    it('should throw NotFoundException if user to delete is not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundException);
      await expect(useCase.execute('non-existent')).rejects.toThrow(`User with id "non-existent" not found`);
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });

    // 3. Edge Case
    it('should bubble up unexpected repository errors during deletion', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: 'user-1' });
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.delete.mockRejectedValue(new Error('Connection Lost'));

      // Act & Assert
      await expect(useCase.execute('user-1')).rejects.toThrow('Connection Lost');
    });
  });
});
