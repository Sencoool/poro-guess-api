import { NotFoundException } from '@nestjs/common';
import { FindDailyChallengeByIdUseCase } from './find-daily-challenge-by-id.use-case';
import { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity } from '../entities/daily-challenge.entity';

describe('FindDailyChallengeByIdUseCase', () => {
  let useCase: FindDailyChallengeByIdUseCase;
  let mockDailyChallengeRepository: jest.Mocked<IDailyChallengeRepository>;

  beforeEach(() => {
    mockDailyChallengeRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    };
    useCase = new FindDailyChallengeByIdUseCase(mockDailyChallengeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a daily challenge if found', async () => {
      // Arrange
      const expectedChallenge = new DailyChallengeEntity({ id: 1, championsId: 5 } as any);
      mockDailyChallengeRepository.findById.mockResolvedValue(expectedChallenge);

      // Act
      const result = await useCase.execute(1);

      // Assert
      expect(mockDailyChallengeRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedChallenge);
    });

    it('should throw NotFoundException if daily challenge is not found', async () => {
      // Arrange
      mockDailyChallengeRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(999)).rejects.toThrow('DailyChallenge with id "999" not found');
    });

    it('should handle repository crashing randomly', async () => {
      // Arrange
      mockDailyChallengeRepository.findById.mockRejectedValue(new Error('Timeout'));

      // Act & Assert
      await expect(useCase.execute(1)).rejects.toThrow('Timeout');
    });
  });
});
