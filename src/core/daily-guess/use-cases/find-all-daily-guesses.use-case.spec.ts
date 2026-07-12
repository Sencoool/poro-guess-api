import { FindAllDailyGuessesUseCase } from './find-all-daily-guesses.use-case';
import { IDailyGuessRepository } from '../repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from '../entities/daily-guess.entity';

describe('FindAllDailyGuessesUseCase', () => {
  let useCase: FindAllDailyGuessesUseCase;
  let mockDailyGuessRepository: jest.Mocked<IDailyGuessRepository>;

  beforeEach(() => {
    mockDailyGuessRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new FindAllDailyGuessesUseCase(mockDailyGuessRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return an array of daily guesses', async () => {
      // Arrange
      const guesses = [
        new DailyGuessEntity({ id: 1 } as any),
        new DailyGuessEntity({ id: 2 } as any),
      ];
      mockDailyGuessRepository.findAll.mockResolvedValue(guesses);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockDailyGuessRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(guesses);
      expect(result.length).toBe(2);
    });

    it('should return an empty array if no daily guesses exist', async () => {
      // Arrange
      mockDailyGuessRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockDailyGuessRepository.findAll.mockRejectedValue(new Error('Database Down'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Database Down');
    });
  });
});
