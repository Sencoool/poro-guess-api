import { NotFoundException } from '@nestjs/common';
import { DeleteDailyChallengeUseCase } from './delete-daily-challenge.use-case';
import { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity } from '../entities/daily-challenge.entity';

describe('DeleteDailyChallengeUseCase', () => {
  let useCase: DeleteDailyChallengeUseCase;
  let mockDailyChallengeRepository: jest.Mocked<IDailyChallengeRepository>;

  beforeEach(() => {
    mockDailyChallengeRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteDailyChallengeUseCase(mockDailyChallengeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a daily challenge successfully', async () => {
      // Arrange
      const existingChallenge = new DailyChallengeEntity({ id: 1 } as any);
      mockDailyChallengeRepository.findById.mockResolvedValue(existingChallenge);
      mockDailyChallengeRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(1);

      // Assert
      expect(mockDailyChallengeRepository.findById).toHaveBeenCalledWith(1);
      expect(mockDailyChallengeRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if daily challenge to delete is not found', async () => {
      // Arrange
      mockDailyChallengeRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(999)).rejects.toThrow('DailyChallenge with id "999" not found');
      expect(mockDailyChallengeRepository.delete).not.toHaveBeenCalled();
    });

    it('should bubble up unexpected repository errors during deletion', async () => {
      // Arrange
      const existingChallenge = new DailyChallengeEntity({ id: 1 } as any);
      mockDailyChallengeRepository.findById.mockResolvedValue(existingChallenge);
      mockDailyChallengeRepository.delete.mockRejectedValue(new Error('Constraint Failure'));

      // Act & Assert
      await expect(useCase.execute(1)).rejects.toThrow('Constraint Failure');
    });
  });
});
