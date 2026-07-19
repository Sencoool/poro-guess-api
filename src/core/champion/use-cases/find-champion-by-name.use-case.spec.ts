import { NotFoundException } from '@nestjs/common';
import { FindChampionByNameUseCase } from './find-champion-by-name.use-case';
import { IChampionRepository } from '../repositories/champion.repository.interface';
import { ChampionEntity } from '../entities/champion.entity';

describe('FindChampionByNameUseCase', () => {
  let useCase: FindChampionByNameUseCase;
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
    useCase = new FindChampionByNameUseCase(mockChampionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a champion if found', async () => {
      // Arrange
      const expectedChampion = new ChampionEntity({ id: 1, name: 'Ahri' } as any);
      mockChampionRepository.findByName.mockResolvedValue(expectedChampion);

      // Act
      const result = await useCase.execute('Ahri');

      // Assert
      expect(mockChampionRepository.findByName).toHaveBeenCalledWith('Ahri');
      expect(result).toEqual(expectedChampion);
    });

    it('should throw NotFoundException if champion is not found', async () => {
      // Arrange
      mockChampionRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('Unknown')).rejects.toThrow(NotFoundException);
      await expect(useCase.execute('Unknown')).rejects.toThrow('Champion with name "Unknown" not found');
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockChampionRepository.findByName.mockRejectedValue(new Error('DB Timeout'));

      // Act & Assert
      await expect(useCase.execute('Ahri')).rejects.toThrow('DB Timeout');
    });
  });
});
