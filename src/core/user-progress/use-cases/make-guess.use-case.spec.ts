import { MakeGuessUseCase } from './make-guess.use-case';
import { IUserProgressRepository } from '../repositories/user-progress.repository.interface';
import { IDailyChallengeRepository } from '../../daily-challenge/repositories/daily-challenge.repository.interface';
import { IUserRepository } from '../../user/repositories/user.repository.interface';
import { IChampionRepository } from '../../champion/repositories/champion.repository.interface';
import { UserDailyProgressEntity } from '../entities/user-progress.entity';
import { DailyChallengeEntity, Mode } from '../../daily-challenge/entities/daily-challenge.entity';
import { UserEntity, Role, Rank } from '../../user/entities/user.entity';
import { ChampionEntity, ChampionRole, DamageType, Resource, RangeType, Gender } from '../../champion/entities/champion.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MakeGuessUseCase', () => {
  let useCase: MakeGuessUseCase;
  let mockUserProgressRepository: jest.Mocked<IUserProgressRepository>;
  let mockDailyChallengeRepository: jest.Mocked<IDailyChallengeRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
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

    mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findTop500Users: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteInactiveGuestUsers: jest.fn(),
      findByUsername: jest.fn(),
      findByProviderId: jest.fn(),
    };

    mockChampionRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new MakeGuessUseCase(
      mockUserProgressRepository,
      mockDailyChallengeRepository,
      mockUserRepository,
      mockChampionRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  const mockProgress = new UserDailyProgressEntity({
    id: 1,
    userId: 'user-1',
    dailyChallengeId: 1,
    guessedChampions: [5],
    isWon: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const mockUser = new UserEntity({
    id: 'user-1',
    username: 'player',
    role: Role.USER,
    isGuest: false,
    isActive: true,
    score: 0,
    rank: Rank.IRON,
    streak: 0,
    lastLogin: new Date(),
    iconPath: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  describe('execute', () => {
    it('should throw NotFoundException if challenge does not exist', async () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute({ userId: 'user-1', dailyChallengeId: 1, championId: 10 })).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user already won the challenge', async () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(mockChallenge);
      mockChampionRepository.findById.mockResolvedValue(mockTargetChampion);
      const wonProgress = new UserDailyProgressEntity({ ...mockProgress, isWon: true });
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(wonProgress);

      await expect(useCase.execute({ userId: 'user-1', dailyChallengeId: 1, championId: 10 })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if champion already guessed', async () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(mockChallenge);
      mockChampionRepository.findById.mockResolvedValue(mockTargetChampion);
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(mockProgress);

      // Guessing 5 again
      await expect(useCase.execute({ userId: 'user-1', dailyChallengeId: 1, championId: 5 })).rejects.toThrow(BadRequestException);
    });

    it('should update progress correctly on a wrong guess', async () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(mockChallenge);
      mockChampionRepository.findById.mockResolvedValue(mockTargetChampion);
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(mockProgress);
      mockUserProgressRepository.update.mockResolvedValue(new UserDailyProgressEntity({ ...mockProgress, guessedChampions: [5, 6] }));

      await useCase.execute({ userId: 'user-1', dailyChallengeId: 1, championId: 6 });

      expect(mockUserProgressRepository.update).toHaveBeenCalledWith({
        id: mockProgress.id,
        guessedChampions: [5, 6],
        isWon: false,
        moves: undefined,
        timeElapsed: undefined,
      });
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should update progress correctly and update streak on a correct guess', async () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(mockChallenge);
      mockChampionRepository.findById.mockResolvedValue(mockTargetChampion);
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(mockProgress);
      mockUserProgressRepository.update.mockResolvedValue(new UserDailyProgressEntity({ ...mockProgress, guessedChampions: [5, 10], isWon: true }));
      mockUserRepository.findById.mockResolvedValue(mockUser);

      await useCase.execute({ userId: 'user-1', dailyChallengeId: 1, championId: 10 });

      expect(mockUserProgressRepository.update).toHaveBeenCalledWith({
        id: mockProgress.id,
        guessedChampions: [5, 10],
        isWon: true,
        moves: undefined,
        timeElapsed: undefined,
      });
      // Streak + Score update verification
      expect(mockUserRepository.update).toHaveBeenCalledWith('user-1', expect.objectContaining({
        streak: 1,
        score: expect.any(Number),
      }));
    });

    it('should process MATCHER mode stats without championId', async () => {
      const matcherChallenge = new DailyChallengeEntity({
        id: 2,
        mode: Mode.MATCHER,
        championsId: 10,
        matcherChampions: [1,2,3],
      });
      mockDailyChallengeRepository.findById.mockResolvedValue(matcherChallenge);
      mockChampionRepository.findById.mockResolvedValue(mockTargetChampion);
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(null);
      mockUserProgressRepository.create.mockResolvedValue(new UserDailyProgressEntity({
        id: 2,
        userId: 'user-1',
        dailyChallengeId: 2,
        guessedChampions: [],
        isWon: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      mockUserProgressRepository.update.mockResolvedValue(new UserDailyProgressEntity({
        id: 2,
        userId: 'user-1',
        dailyChallengeId: 2,
        guessedChampions: [],
        isWon: true,
        moves: 30,
        timeElapsed: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      mockUserRepository.findById.mockResolvedValue(mockUser);

      await useCase.execute({ userId: 'user-1', dailyChallengeId: 2, moves: 30, timeElapsed: 120, isWon: true });

      expect(mockUserProgressRepository.update).toHaveBeenCalledWith({
        id: 2,
        guessedChampions: [],
        isWon: true,
        moves: 30,
        timeElapsed: 120,
      });
      expect(mockUserRepository.update).toHaveBeenCalledWith('user-1', expect.objectContaining({
        streak: 1,
      }));
    });
  });
});
