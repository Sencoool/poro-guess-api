import { Test, TestingModule } from '@nestjs/testing';
import { UserProgressController } from './user-progress.controller';
import { MakeGuessDto } from './dto/make-guess.dto';
import { UserProgressResponse } from './responses/user-progress.response';
import { GetUserProgressUseCase } from '../../core/user-progress/use-cases/get-user-progress.use-case';
import { MakeGuessUseCase } from '../../core/user-progress/use-cases/make-guess.use-case';
import { UserDailyProgressEntity } from '../../core/user-progress/entities/user-progress.entity';

describe('UserProgressController', () => {
  let controller: UserProgressController;
  let mockGetUserProgressUseCase: jest.Mocked<GetUserProgressUseCase>;
  let mockMakeGuessUseCase: jest.Mocked<MakeGuessUseCase>;

  beforeEach(async () => {
    mockGetUserProgressUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetUserProgressUseCase>;

    mockMakeGuessUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<MakeGuessUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProgressController],
      providers: [
        {
          provide: GetUserProgressUseCase,
          useValue: mockGetUserProgressUseCase,
        },
        {
          provide: MakeGuessUseCase,
          useValue: mockMakeGuessUseCase,
        },
      ],
    }).compile();

    controller = module.get<UserProgressController>(UserProgressController);
  });

  const mockProgress = new UserDailyProgressEntity({
    id: 1,
    userId: 'user-1',
    dailyChallengeId: 1,
    guessedChampions: [],
    isWon: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should call getUserProgressUseCase and return progress', async () => {
      mockGetUserProgressUseCase.execute.mockResolvedValue(mockProgress);

      const result = await controller.findOne('user-1', 1);

      expect(mockGetUserProgressUseCase.execute).toHaveBeenCalledWith('user-1', 1);
      expect(result).toEqual(new UserProgressResponse(mockProgress));
    });
  });

  describe('makeGuess', () => {
    it('should call makeGuessUseCase and return updated progress', async () => {
      const dto: MakeGuessDto = {
        championId: 10,
        moves: 5,
        timeElapsed: 100,
        isWon: true,
      };

      const updatedProgress = new UserDailyProgressEntity({
        ...mockProgress,
        guessedChampions: [10],
        isWon: true,
        moves: 5,
        timeElapsed: 100,
      });

      mockMakeGuessUseCase.execute.mockResolvedValue(updatedProgress);

      const result = await controller.makeGuess('user-1', 1, dto);

      expect(mockMakeGuessUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-1',
        dailyChallengeId: 1,
        championId: 10,
        moves: 5,
        timeElapsed: 100,
        isWon: true,
      });
      expect(result).toEqual(new UserProgressResponse(updatedProgress));
    });
  });
});
