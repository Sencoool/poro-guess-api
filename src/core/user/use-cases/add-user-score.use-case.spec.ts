import { NotFoundException } from '@nestjs/common';
import { AddUserScoreUseCase } from './add-user-score.use-case';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity, Rank } from '../entities/user.entity';

describe('AddUserScoreUseCase', () => {
  let useCase: AddUserScoreUseCase;
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
    useCase = new AddUserScoreUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should add score and not rank up if threshold is not met', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: '1', score: 50, rank: Rank.IRON } as any);
      mockUserRepository.findById.mockResolvedValue(existingUser);
      
      const updatedUser = new UserEntity({ id: '1', score: 80, rank: Rank.IRON } as any);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await useCase.execute({ id: '1', scoreToAdd: 30 });

      // Assert
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', { score: 80, rank: Rank.IRON });
      expect(result.isRankUp).toBe(false);
      expect(result.previousRank).toBe(Rank.IRON);
      expect(result.user).toEqual(updatedUser);
    });

    it('should add score and trigger rank up if threshold is exceeded', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: '1', score: 80, rank: Rank.IRON } as any);
      mockUserRepository.findById.mockResolvedValue(existingUser);
      
      const updatedUser = new UserEntity({ id: '1', score: 120, rank: Rank.BRONZE } as any);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await useCase.execute({ id: '1', scoreToAdd: 40 });

      // Assert
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', { score: 120, rank: Rank.BRONZE });
      expect(result.isRankUp).toBe(true);
      expect(result.previousRank).toBe(Rank.IRON);
      expect(result.user).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute({ id: 'unknown', scoreToAdd: 10 })).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
