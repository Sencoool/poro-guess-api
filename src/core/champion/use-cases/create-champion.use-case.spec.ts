import { CreateChampionUseCase } from './create-champion.use-case';
import { IChampionRepository } from '../repositories/champion.repository.interface';
import { ChampionEntity, Gender, ChampionRole, DamageType, Resource, RangeType } from '../entities/champion.entity';

describe('CreateChampionUseCase', () => {
  let useCase: CreateChampionUseCase;
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
    useCase = new CreateChampionUseCase(mockChampionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new champion successfully', async () => {
      // Arrange
      const command = {
        name: 'Ahri',
        gender: Gender.FEMALE,
        role: ChampionRole.MID,
        damageType: DamageType.MAGIC,
        resource: Resource.MANA,
        rangeType: RangeType.RANGE,
        yearRelease: 2011,
        traits: ['Ionia', 'Vastaya'],
        iconPath: 'ahri_icon.png',
        splashPath: ['ahri_splash.png'],
        hint: 'Fox',
      };
      
      const expectedChampion = new ChampionEntity({ id: 1, ...command });
      mockChampionRepository.create.mockResolvedValue(expectedChampion);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockChampionRepository.create).toHaveBeenCalledWith(command);
      expect(result).toEqual(expectedChampion);
    });

    it('should handle repository throwing an unexpected error gracefully', async () => {
      // Arrange
      const command = {
        name: 'Ahri',
        gender: Gender.FEMALE,
        role: ChampionRole.MID,
        damageType: DamageType.MAGIC,
        resource: Resource.MANA,
        rangeType: RangeType.RANGE,
        yearRelease: 2011,
        traits: ['Ionia', 'Vastaya'],
        iconPath: 'ahri_icon.png',
        splashPath: ['ahri_splash.png'],
        hint: 'Fox',
      };
      mockChampionRepository.create.mockRejectedValue(new Error('DB Unique Constraint Error'));

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('DB Unique Constraint Error');
    });
  });
});
