import { NotFoundException } from '@nestjs/common';
import { FindDailyGuessByIdUseCase } from './find-daily-guess-by-id.use-case';
import { IDailyGuessRepository } from '../repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from '../entities/daily-guess.entity';

describe('FindDailyGuessByIdUseCase', () => {
  let useCase: FindDailyGuessByIdUseCase;
  let mockDailyGuessRepository: jest.Mocked<IDailyGuessRepository>;

  beforeEach(() => {
    mockDailyGuessRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new FindDailyGuessByIdUseCase(mockDailyGuessRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a daily guess if found', async () => {
      // Arrange
      const expectedGuess = new DailyGuessEntity({ id: 1, championsId: 5 } as any);
      mockDailyGuessRepository.findById.mockResolvedValue(expectedGuess);

      // Act
      const result = await useCase.execute(1);

      // Assert
      expect(mockDailyGuessRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedGuess);
    });

    it('should throw NotFoundException if daily guess is not found', async () => {
      // Arrange
      mockDailyGuessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(999)).rejects.toThrow('DailyGuess with id "999" not found');
    });

    it('should handle repository crashing randomly', async () => {
      // Arrange
      mockDailyGuessRepository.findById.mockRejectedValue(new Error('Timeout'));

      // Act & Assert
      await expect(useCase.execute(1)).rejects.toThrow('Timeout');
    });
  });
});
