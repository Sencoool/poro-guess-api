import { RandomizeDailyChallengesUseCase } from './randomize-daily-challenges.use-case';
import { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';
import { IDailyGuessRepository } from '../../daily-guess/repositories/daily-guess.repository.interface';
import { IChampionRepository } from '../../champion/repositories/champion.repository.interface';
import { ChampionEntity } from '../../champion/entities/champion.entity';
import { Gender, ChampionRole, DamageType, Resource, RangeType } from '../../champion/entities/champion.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Mode } from '../entities/daily-challenge.entity';

describe('RandomizeDailyChallengesUseCase', () => {
  let useCase: RandomizeDailyChallengesUseCase;
  let mockDailyChallengeRepository: jest.Mocked<IDailyChallengeRepository>;
  let mockDailyGuessRepository: jest.Mocked<IDailyGuessRepository>;
  let mockChampionRepository: jest.Mocked<IChampionRepository>;

  const createMockChampion = (id: number): ChampionEntity => new ChampionEntity({
    id,
    name: `Champion ${id}`,
    gender: Gender.MALE,
    role: ChampionRole.TOP,
    damageType: DamageType.PHYSICAL,
    resource: Resource.MANA,
    rangeType: RangeType.MELEE,
    yearRelease: 2020,
    traits: [],
    iconPath: 'icon.png',
    splashPath: [],
    hint: 'hint',
  });

  beforeEach(() => {
    mockDailyChallengeRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    };

    mockDailyGuessRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
      resetAllGuessCounts: jest.fn(),
    };

    mockChampionRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new RandomizeDailyChallengesUseCase(
      mockDailyChallengeRepository,
      mockDailyGuessRepository,
      mockChampionRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should throw InternalServerErrorException if there are less than 3 champions', async () => {
      mockChampionRepository.findAll.mockResolvedValue([createMockChampion(1), createMockChampion(2)]);

      await expect(useCase.execute()).rejects.toThrow(InternalServerErrorException);
      expect(mockChampionRepository.findAll).toHaveBeenCalled();
      expect(mockDailyGuessRepository.deleteAll).not.toHaveBeenCalled();
      expect(mockDailyChallengeRepository.deleteAll).not.toHaveBeenCalled();
    });

    it('should delete old records and create 3 new daily challenges with distinct random champions', async () => {
      const allChampions = [
        createMockChampion(1),
        createMockChampion(2),
        createMockChampion(3),
        createMockChampion(4),
        createMockChampion(5),
      ];
      mockChampionRepository.findAll.mockResolvedValue(allChampions);
      mockDailyGuessRepository.deleteAll.mockResolvedValue(10);
      mockDailyChallengeRepository.deleteAll.mockResolvedValue(3);
      mockDailyChallengeRepository.create.mockResolvedValue({} as any);

      await useCase.execute();

      expect(mockChampionRepository.findAll).toHaveBeenCalled();
      expect(mockDailyGuessRepository.deleteAll).toHaveBeenCalled();
      expect(mockDailyChallengeRepository.deleteAll).toHaveBeenCalled();
      
      expect(mockDailyChallengeRepository.create).toHaveBeenCalledTimes(3);
      
      const createCalls = mockDailyChallengeRepository.create.mock.calls;
      const modesCreated = createCalls.map(call => call[0].mode);
      const championIdsSelected = createCalls.map(call => call[0].championsId);

      expect(modesCreated).toContain(Mode.CLASSIC);
      expect(modesCreated).toContain(Mode.JIGSAW);
      expect(modesCreated).toContain(Mode.TRAITS);

      // Verify that the 3 selected champions are unique
      const uniqueChampionIds = new Set(championIdsSelected);
      expect(uniqueChampionIds.size).toBe(3);
    });
  });
});
