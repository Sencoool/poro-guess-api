import { CreateDailyGuessUseCase } from './create-daily-guess.use-case';
import { IDailyGuessRepository } from '../repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from '../entities/daily-guess.entity';

describe('CreateDailyGuessUseCase', () => {
  let useCase: CreateDailyGuessUseCase;
  let mockDailyGuessRepository: jest.Mocked<IDailyGuessRepository>;

  beforeEach(() => {
    mockDailyGuessRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateDailyGuessUseCase(mockDailyGuessRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new daily guess successfully', async () => {
      // Arrange
      const command = {
        guessCount: 3,
        championsId: 5,
        dailyChallengeId: 10,
      };
      
      const expectedGuess = new DailyGuessEntity({ id: 1, ...command });
      mockDailyGuessRepository.create.mockResolvedValue(expectedGuess);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockDailyGuessRepository.create).toHaveBeenCalledWith(command);
      expect(result).toEqual(expectedGuess);
    });

    it('should bubble up unexpected errors during creation', async () => {
      // Arrange
      const command = {
        championsId: 5,
        dailyChallengeId: 10,
      };
      mockDailyGuessRepository.create.mockRejectedValue(new Error('DB Unique Constraint Failure'));

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow('DB Unique Constraint Failure');
    });
  });
});
