import { CreateDailyChallengeUseCase } from './create-daily-challenge.use-case';
import { IDailyChallengeRepository } from '../repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity, Mode } from '../entities/daily-challenge.entity';

describe('CreateDailyChallengeUseCase', () => {
  let useCase: CreateDailyChallengeUseCase;
  let mockDailyChallengeRepository: jest.Mocked<IDailyChallengeRepository>;

  beforeEach(() => {
    mockDailyChallengeRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateDailyChallengeUseCase(mockDailyChallengeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new daily challenge successfully', async () => {
      // Arrange
      const command = {
        mode: Mode.CLASSIC,
        championsId: 10,
      };
      
      const expectedChallenge = new DailyChallengeEntity({ id: 1, ...command });
      mockDailyChallengeRepository.create.mockResolvedValue(expectedChallenge);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockDailyChallengeRepository.create).toHaveBeenCalledWith(command);
      expect(result).toEqual(expectedChallenge);
    });

    it('should bubble up unexpected errors during creation', async () => {
      // Arrange
      const command = {
        mode: Mode.CLASSIC,
        championsId: 10,
      };
      mockDailyChallengeRepository.create.mockRejectedValue(new Error('Unique Constraint Failed'));

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('Unique Constraint Failed');
    });
  });
});
