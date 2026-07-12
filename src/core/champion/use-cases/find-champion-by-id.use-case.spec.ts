import { NotFoundException } from '@nestjs/common';
import { FindChampionByIdUseCase } from './find-champion-by-id.use-case';
import { IChampionRepository } from '../repositories/champion.repository.interface';
import { ChampionEntity } from '../entities/champion.entity';

describe('FindChampionByIdUseCase', () => {
  let useCase: FindChampionByIdUseCase;
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
    useCase = new FindChampionByIdUseCase(mockChampionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a champion if found', async () => {
      // Arrange
      const expectedChampion = new ChampionEntity({ id: 1, name: 'Ahri' } as any);
      mockChampionRepository.findById.mockResolvedValue(expectedChampion);

      // Act
      const result = await useCase.execute(1);

      // Assert
      expect(mockChampionRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedChampion);
    });

    it('should throw NotFoundException if champion is not found', async () => {
      // Arrange
      mockChampionRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(999)).rejects.toThrow('Champion with id "999" not found');
    });

    it('should handle repository crashing randomly', async () => {
      // Arrange
      mockChampionRepository.findById.mockRejectedValue(new Error('Timeout'));

      // Act & Assert
      await expect(useCase.execute(1)).rejects.toThrow('Timeout');
    });
  });
});
