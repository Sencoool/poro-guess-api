import { FindAllDailyChallengesUseCase } from './find-all-daily-challenges.use-case';
import { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity } from '../entities/daily-challenge.entity';

describe('FindAllDailyChallengesUseCase', () => {
  let useCase: FindAllDailyChallengesUseCase;
  let mockDailyChallengeRepository: jest.Mocked<IDailyChallengeRepository>;

  beforeEach(() => {
    mockDailyChallengeRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new FindAllDailyChallengesUseCase(mockDailyChallengeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return an array of daily challenges', async () => {
      // Arrange
      const challenges = [
        new DailyChallengeEntity({ id: 1 } as any),
        new DailyChallengeEntity({ id: 2 } as any),
      ];
      mockDailyChallengeRepository.findAll.mockResolvedValue(challenges);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockDailyChallengeRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(challenges);
      expect(result.length).toBe(2);
    });

    it('should return an empty array if no daily challenges exist', async () => {
      // Arrange
      mockDailyChallengeRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockDailyChallengeRepository.findAll.mockRejectedValue(new Error('Database Down'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Database Down');
    });
  });
});
