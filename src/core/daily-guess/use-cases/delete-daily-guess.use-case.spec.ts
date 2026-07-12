import { NotFoundException } from '@nestjs/common';
import { DeleteDailyGuessUseCase } from './delete-daily-guess.use-case';
import { IDailyGuessRepository } from '../repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from '../entities/daily-guess.entity';

describe('DeleteDailyGuessUseCase', () => {
  let useCase: DeleteDailyGuessUseCase;
  let mockDailyGuessRepository: jest.Mocked<IDailyGuessRepository>;

  beforeEach(() => {
    mockDailyGuessRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteDailyGuessUseCase(mockDailyGuessRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a daily guess successfully', async () => {
      // Arrange
      const existingGuess = new DailyGuessEntity({ id: 1 } as any);
      mockDailyGuessRepository.findById.mockResolvedValue(existingGuess);
      mockDailyGuessRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(1);

      // Assert
      expect(mockDailyGuessRepository.findById).toHaveBeenCalledWith(1);
      expect(mockDailyGuessRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if daily guess to delete is not found', async () => {
      // Arrange
      mockDailyGuessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(999)).rejects.toThrow('DailyGuess with id "999" not found');
      expect(mockDailyGuessRepository.delete).not.toHaveBeenCalled();
    });

    it('should bubble up unexpected repository errors during deletion', async () => {
      // Arrange
      const existingGuess = new DailyGuessEntity({ id: 1 } as any);
      mockDailyGuessRepository.findById.mockResolvedValue(existingGuess);
      mockDailyGuessRepository.delete.mockRejectedValue(new Error('Constraint Failure'));

      // Act & Assert
      await expect(useCase.execute(1)).rejects.toThrow('Constraint Failure');
    });
  });
});
