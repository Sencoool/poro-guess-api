import { NotFoundException } from '@nestjs/common';
import { UpdateChampionUseCase } from './update-champion.use-case';
import { IChampionRepository } from '../repositories/champion.repository.interface';
import { ChampionEntity, Gender, ChampionRole, DamageType, Resource, RangeType } from '../entities/champion.entity';

describe('UpdateChampionUseCase', () => {
  let useCase: UpdateChampionUseCase;
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
    useCase = new UpdateChampionUseCase(mockChampionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update champion successfully when valid data is provided', async () => {
      // Arrange
      const existingChampion = new ChampionEntity({
        id: 1, name: 'Ahri', gender: Gender.FEMALE, role: ChampionRole.MID, damageType: DamageType.MAGIC,
        resource: Resource.MANA, rangeType: RangeType.RANGE, yearRelease: 2011, traits: [],
        iconPath: '', splashPath: [], hint: ''
      });
      mockChampionRepository.findById.mockResolvedValue(existingChampion);
      
      const updatedChampion = new ChampionEntity({ ...existingChampion, hint: 'Nine-Tailed Fox' });
      mockChampionRepository.update.mockResolvedValue(updatedChampion);

      const command = { id: 1, hint: 'Nine-Tailed Fox' };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockChampionRepository.findById).toHaveBeenCalledWith(1);
      expect(mockChampionRepository.update).toHaveBeenCalledWith(1, { hint: 'Nine-Tailed Fox' });
      expect(result).toEqual(updatedChampion);
    });

    it('should throw NotFoundException if champion to update does not exist', async () => {
      // Arrange
      mockChampionRepository.findById.mockResolvedValue(null);
      const command = { id: 999, name: 'Test' };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(command)).rejects.toThrow('Champion with id "999" not found');
      expect(mockChampionRepository.update).not.toHaveBeenCalled();
    });

    it('should bubble up database errors during update', async () => {
      // Arrange
      const existingChampion = new ChampionEntity({ id: 1 } as any);
      mockChampionRepository.findById.mockResolvedValue(existingChampion);
      mockChampionRepository.update.mockRejectedValue(new Error('Connection timeout'));

      const command = { id: 1, name: 'Test' };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('Connection timeout');
    });
  });
});
