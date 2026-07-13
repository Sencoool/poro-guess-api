import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UpdateUserUseCase } from './update-user.use-case';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity, Role, Rank } from '../entities/user.entity';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
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

    useCase = new UpdateUserUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    // 1. Happy Path
    it('should update user successfully without password change', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: 'user-1', email: 'test@example.com' });
      mockUserRepository.findById.mockResolvedValue(existingUser);
      
      const updatedUser = new UserEntity({ id: 'user-1', username: 'newname' });
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const command = { id: 'user-1', username: 'newname' };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-1');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith('user-1', { username: 'newname' });
      expect(result).toEqual(updatedUser);
    });

    // 2. Unhappy Path
    it('should throw NotFoundException if user to update does not exist', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);
      const command = { id: 'missing-user', username: 'test' };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(command)).rejects.toThrow(`User with id "missing-user" not found`);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    // 3. Edge Case
    it('should bubble up database errors during update', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: 'user-1' });
      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockRejectedValue(new Error('DB Update Error'));

      const command = { id: 'user-1', username: 'test' };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('DB Update Error');
    });
  });
});
