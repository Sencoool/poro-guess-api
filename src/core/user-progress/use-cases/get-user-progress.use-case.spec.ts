import { GetUserProgressUseCase } from './get-user-progress.use-case';
import { NotFoundException } from '@nestjs/common';
import { IUserProgressRepository } from '../repositories/user-progress.repository.interface';
import { UserDailyProgressEntity } from '../entities/user-progress.entity';

describe('GetUserProgressUseCase', () => {
  let useCase: GetUserProgressUseCase;
  let mockUserProgressRepository: jest.Mocked<IUserProgressRepository>;

  beforeEach(() => {
    mockUserProgressRepository = {
      findByUserAndChallenge: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    useCase = new GetUserProgressUseCase(mockUserProgressRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return existing progress if found', async () => {
      const mockProgress = new UserDailyProgressEntity({
        id: 1,
        userId: 'user-1',
        dailyChallengeId: 1,
        guessedChampions: [5],
        isWon: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(mockProgress);

      const result = await useCase.execute('user-1', 1);

      expect(mockUserProgressRepository.findByUserAndChallenge).toHaveBeenCalledWith('user-1', 1);
      expect(result).toEqual(mockProgress);
      expect(mockUserProgressRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if progress not found', async () => {
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(null);

      await expect(useCase.execute('user-1', 1)).rejects.toThrow(NotFoundException);
      expect(mockUserProgressRepository.findByUserAndChallenge).toHaveBeenCalledWith('user-1', 1);
    });
  });
});
