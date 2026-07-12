import { FindAllChampionsUseCase } from './find-all-champions.use-case';
import { IChampionRepository } from '../repositories/champion.repository.interface';
import { ChampionEntity } from '../entities/champion.entity';

describe('FindAllChampionsUseCase', () => {
  let useCase: FindAllChampionsUseCase;
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
    useCase = new FindAllChampionsUseCase(mockChampionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return an array of champions', async () => {
      // Arrange
      const champions = [
        new ChampionEntity({ id: 1 } as any),
        new ChampionEntity({ id: 2 } as any),
      ];
      mockChampionRepository.findAll.mockResolvedValue(champions);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockChampionRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(champions);
      expect(result.length).toBe(2);
    });

    it('should return an empty array if no champions exist', async () => {
      // Arrange
      mockChampionRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockChampionRepository.findAll.mockRejectedValue(new Error('Database Down'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Database Down');
    });
  });
});
