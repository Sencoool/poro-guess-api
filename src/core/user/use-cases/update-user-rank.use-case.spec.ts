import { NotFoundException } from '@nestjs/common';
import { UpdateUserRankUseCase } from './update-user-rank.use-case';
import { IUserRepository } from '../repositories/user.repository.interface';
import { UserEntity, Rank } from '../entities/user.entity';

describe('UpdateUserRankUseCase', () => {
  let useCase: UpdateUserRankUseCase;
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
    };
    useCase = new UpdateUserRankUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update rank to GOLD when score is 650', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: '1', score: 650, rank: Rank.SILVER } as any);
      mockUserRepository.findById.mockResolvedValue(existingUser);
      
      const updatedUser = new UserEntity({ id: '1', score: 650, rank: Rank.GOLD } as any);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await useCase.execute({ id: '1' });

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', { rank: Rank.GOLD });
      expect(result.rank).toEqual(Rank.GOLD);
    });

    it('should not update rank if score does not exceed threshold for next rank', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: '1', score: 249, rank: Rank.BRONZE } as any);
      mockUserRepository.findById.mockResolvedValue(existingUser);

      // Act
      const result = await useCase.execute({ id: '1' });

      // Assert
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(result.rank).toEqual(Rank.BRONZE);
    });

    it('should upgrade directly to CHALLENGER if score is extremely high', async () => {
      // Arrange
      const existingUser = new UserEntity({ id: '1', score: 9999, rank: Rank.IRON } as any);
      mockUserRepository.findById.mockResolvedValue(existingUser);
      
      const updatedUser = new UserEntity({ id: '1', score: 9999, rank: Rank.CHALLENGER } as any);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await useCase.execute({ id: '1' });

      // Assert
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', { rank: Rank.CHALLENGER });
      expect(result.rank).toEqual(Rank.CHALLENGER);
    });

    it('should throw NotFoundException if user is not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute({ id: 'unknown' })).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
