import { NotFoundException } from '@nestjs/common';
import { UpdateDailyGuessUseCase } from './update-daily-guess.use-case';
import { IDailyGuessRepository } from '../repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from '../entities/daily-guess.entity';

describe('UpdateDailyGuessUseCase', () => {
  let useCase: UpdateDailyGuessUseCase;
  let mockDailyGuessRepository: jest.Mocked<IDailyGuessRepository>;

  beforeEach(() => {
    mockDailyGuessRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UpdateDailyGuessUseCase(mockDailyGuessRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update daily guess successfully when valid data is provided', async () => {
      // Arrange
      const existingGuess = new DailyGuessEntity({ id: 1, guessCount: 1, championsId: 5, dailyChallengeId: 10 });
      mockDailyGuessRepository.findById.mockResolvedValue(existingGuess);
      
      const updatedGuess = new DailyGuessEntity({ id: 1, guessCount: 2, championsId: 5, dailyChallengeId: 10 });
      mockDailyGuessRepository.update.mockResolvedValue(updatedGuess);

      const command = { id: 1, guessCount: 2 };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockDailyGuessRepository.findById).toHaveBeenCalledWith(1);
      expect(mockDailyGuessRepository.update).toHaveBeenCalledWith(1, { guessCount: 2 });
      expect(result).toEqual(updatedGuess);
    });

    it('should throw NotFoundException if daily guess to update does not exist', async () => {
      // Arrange
      mockDailyGuessRepository.findById.mockResolvedValue(null);
      const command = { id: 999, guessCount: 5 };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(command)).rejects.toThrow('DailyGuess with id "999" not found');
      expect(mockDailyGuessRepository.update).not.toHaveBeenCalled();
    });

    it('should bubble up database errors during update', async () => {
      // Arrange
      const existingGuess = new DailyGuessEntity({ id: 1 } as any);
      mockDailyGuessRepository.findById.mockResolvedValue(existingGuess);
      mockDailyGuessRepository.update.mockRejectedValue(new Error('Connection timeout'));

      const command = { id: 1, championsId: 20 };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('Connection timeout');
    });
  });
});
