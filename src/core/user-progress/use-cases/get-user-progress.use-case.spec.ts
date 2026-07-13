import { GetUserProgressUseCase } from './get-user-progress.use-case';
import { NotFoundException } from '@nestjs/common';
import { IUserProgressRepository } from '../repositories/user-progress.repository.interface';
import { IDailyChallengeRepository } from '../../daily-challenge/repositories/daily-challenge.repository.interface';
import { IChampionRepository } from '../../champion/repositories/champion.repository.interface';
import { UserDailyProgressEntity } from '../entities/user-progress.entity';
import { DailyChallengeEntity, Mode } from '../../daily-challenge/entities/daily-challenge.entity';
import { ChampionEntity, ChampionRole, DamageType, Resource, RangeType, Gender } from '../../champion/entities/champion.entity';

describe('GetUserProgressUseCase', () => {
  let useCase: GetUserProgressUseCase;
  let mockUserProgressRepository: jest.Mocked<IUserProgressRepository>;
  let mockDailyChallengeRepository: jest.Mocked<IDailyChallengeRepository>;
  let mockChampionRepository: jest.Mocked<IChampionRepository>;

  beforeEach(() => {
    mockUserProgressRepository = {
      findByUserAndChallenge: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    mockDailyChallengeRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      deleteAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockChampionRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetUserProgressUseCase(
      mockUserProgressRepository,
      mockDailyChallengeRepository,
      mockChampionRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return progress and guesses if found', async () => {
      const mockProgress = new UserDailyProgressEntity({
        id: 1,
        userId: 'user-1',
        dailyChallengeId: 1,
        guessedChampions: [5],
        isWon: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const mockChallenge = new DailyChallengeEntity({
        id: 1,
        mode: Mode.CLASSIC,
        championsId: 10,
        matcherChampions: [],
      });

      const mockTargetChampion = new ChampionEntity({
        id: 10,
        name: 'Aatrox',
        gender: Gender.MALE,
        role: ChampionRole.TOP,
        damageType: DamageType.PHYSICAL,
        resource: Resource.MANALESS,
        rangeType: RangeType.MELEE,
        yearRelease: 2013,
        traits: ['Darkin'],
        iconPath: 'icon.png',
        splashPath: ['splash.png'],
        hint: 'A hint',
      });

      const mockGuessedChampion = new ChampionEntity({
        id: 5,
        name: 'Ahri',
        gender: Gender.FEMALE,
        role: ChampionRole.MID,
        damageType: DamageType.MAGIC,
        resource: Resource.MANA,
        rangeType: RangeType.RANGE,
        yearRelease: 2011,
        traits: ['Vastaya'],
        iconPath: 'icon2.png',
        splashPath: ['splash2.png'],
        hint: 'Another hint',
      });

      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(mockProgress);
      mockDailyChallengeRepository.findById.mockResolvedValue(mockChallenge);
      mockChampionRepository.findById.mockImplementation(async (id) => {
        if (id === 10) return mockTargetChampion;
        if (id === 5) return mockGuessedChampion;
        return null;
      });

      const result = await useCase.execute('user-1', 1);

      expect(mockUserProgressRepository.findByUserAndChallenge).toHaveBeenCalledWith('user-1', 1);
      expect(result.progress).toEqual(mockProgress);
      expect(result.guesses.length).toBe(1);
      expect(result.guesses[0].champion.name).toBe('Ahri');
    });

    it('should throw NotFoundException if progress not found', async () => {
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(null);

      await expect(useCase.execute('user-1', 1)).rejects.toThrow(NotFoundException);
      expect(mockUserProgressRepository.findByUserAndChallenge).toHaveBeenCalledWith('user-1', 1);
    });
  });
});
