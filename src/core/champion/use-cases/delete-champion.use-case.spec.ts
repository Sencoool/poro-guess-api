import { NotFoundException } from '@nestjs/common';
import { DeleteChampionUseCase } from './delete-champion.use-case';
import { IChampionRepository } from '../repositories/champion.repository.interface';
import { ChampionEntity } from '../entities/champion.entity';

describe('DeleteChampionUseCase', () => {
  let useCase: DeleteChampionUseCase;
  let mockChampionRepository: jest.Mocked<IChampionRepository>;

  beforeEach(() => {
    mockChampionRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteChampionUseCase(mockChampionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a champion successfully', async () => {
      // Arrange
      const existingChampion = new ChampionEntity({ id: 1 } as any);
      mockChampionRepository.findById.mockResolvedValue(existingChampion);
      mockChampionRepository.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(1);

      // Assert
      expect(mockChampionRepository.findById).toHaveBeenCalledWith(1);
      expect(mockChampionRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if champion to delete is not found', async () => {
      // Arrange
      mockChampionRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(999)).rejects.toThrow('Champion with id "999" not found');
      expect(mockChampionRepository.delete).not.toHaveBeenCalled();
    });

    it('should bubble up unexpected repository errors during deletion', async () => {
      // Arrange
      const existingChampion = new ChampionEntity({ id: 1 } as any);
      mockChampionRepository.findById.mockResolvedValue(existingChampion);
      mockChampionRepository.delete.mockRejectedValue(new Error('Constraint Failure'));

      // Act & Assert
      await expect(useCase.execute(1)).rejects.toThrow('Constraint Failure');
    });
  });
});
