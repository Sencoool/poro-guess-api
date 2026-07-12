import { NotFoundException } from '@nestjs/common';
import { UpdateDailyChallengeUseCase } from './update-daily-challenge.use-case';
import { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity, Mode } from '../entities/daily-challenge.entity';

describe('UpdateDailyChallengeUseCase', () => {
  let useCase: UpdateDailyChallengeUseCase;
  let mockDailyChallengeRepository: jest.Mocked<IDailyChallengeRepository>;

  beforeEach(() => {
    mockDailyChallengeRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    };
    useCase = new UpdateDailyChallengeUseCase(mockDailyChallengeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update daily challenge successfully when valid data is provided', async () => {
      // Arrange
      const existingChallenge = new DailyChallengeEntity({ id: 1, mode: Mode.CLASSIC, championsId: 10 });
      mockDailyChallengeRepository.findById.mockResolvedValue(existingChallenge);
      
      const updatedChallenge = new DailyChallengeEntity({ id: 1, mode: Mode.JIGSAW, championsId: 10 });
      mockDailyChallengeRepository.update.mockResolvedValue(updatedChallenge);

      const command = { id: 1, mode: Mode.JIGSAW };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockDailyChallengeRepository.findById).toHaveBeenCalledWith(1);
      expect(mockDailyChallengeRepository.update).toHaveBeenCalledWith(1, { mode: Mode.JIGSAW });
      expect(result).toEqual(updatedChallenge);
    });

    it('should throw NotFoundException if daily challenge to update does not exist', async () => {
      // Arrange
      mockDailyChallengeRepository.findById.mockResolvedValue(null);
      const command = { id: 999, mode: Mode.TRAITS };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(command)).rejects.toThrow('DailyChallenge with id "999" not found');
      expect(mockDailyChallengeRepository.update).not.toHaveBeenCalled();
    });

    it('should bubble up database errors during update', async () => {
      // Arrange
      const existingChallenge = new DailyChallengeEntity({ id: 1 } as any);
      mockDailyChallengeRepository.findById.mockResolvedValue(existingChallenge);
      mockDailyChallengeRepository.update.mockRejectedValue(new Error('Connection timeout'));

      const command = { id: 1, championsId: 20 };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('Connection timeout');
    });
  });
});
