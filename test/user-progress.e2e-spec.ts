import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { USER_PROGRESS_REPOSITORY } from './../src/core/user-progress/repositories/user-progress.repository.interface';
import { DAILY_CHALLENGE_REPOSITORY } from './../src/core/daily-challenge/repositories/daily-challenge.repository.interface';
import { USER_REPOSITORY } from './../src/core/user/repositories/user.repository.interface';
import { UserDailyProgressEntity } from './../src/core/user-progress/entities/user-progress.entity';
import { DailyChallengeEntity, Mode } from './../src/core/daily-challenge/entities/daily-challenge.entity';
import { UserEntity, Role, Rank } from './../src/core/user/entities/user.entity';

describe('UserProgressController (e2e)', () => {
  let app: INestApplication<App>;

  const mockUserProgressRepository = {
    findByUserAndChallenge: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockDailyChallengeRepository = {
    findById: jest.fn(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(USER_PROGRESS_REPOSITORY)
      .useValue(mockUserProgressRepository)
      .overrideProvider(DAILY_CHALLENGE_REPOSITORY)
      .useValue(mockDailyChallengeRepository)
      .overrideProvider(USER_REPOSITORY)
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockProgress = new UserDailyProgressEntity({
    id: 1,
    userId: 'user-1',
    dailyChallengeId: 1,
    guessedChampions: [5],
    isWon: false,
    moves: undefined,
    timeElapsed: undefined,
    createdAt: new Date('2026-07-13T00:00:00Z'),
    updatedAt: new Date('2026-07-13T00:00:00Z'),
  });

  const mockChallenge = new DailyChallengeEntity({
    id: 1,
    mode: Mode.CLASSIC,
    championsId: 10,
    matcherChampions: [],
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

  describe('/user-progress/:userId/:dailyChallengeId (GET)', () => {
    it('should return user progress if found', () => {
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(mockProgress);

      return request(app.getHttpServer())
        .get('/user-progress/user-1/1')
        .expect(200)
        .expect((res) => {
          expect(res.body.userId).toEqual('user-1');
          expect(res.body.dailyChallengeId).toEqual(1);
          expect(res.body.guessedChampions).toEqual([5]);
          expect(res.body.isWon).toEqual(false);
        });
    });

    it('should return 404 if user progress is not found', () => {
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/user-progress/user-1/999')
        .expect(404);
    });
  });

  describe('/user-progress/:userId/:dailyChallengeId/guess (POST)', () => {
    it('should correctly make a guess and return updated progress', () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(mockChallenge);
      mockUserProgressRepository.findByUserAndChallenge.mockResolvedValue(mockProgress);
      
      const updatedProgress = new UserDailyProgressEntity({
        ...mockProgress,
        guessedChampions: [5, 10],
        isWon: true,
      });

      mockUserProgressRepository.update.mockResolvedValue(updatedProgress);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue({ ...mockUser, streak: 1 } as any);

      return request(app.getHttpServer())
        .post('/user-progress/user-1/1/guess')
        .send({
          championId: 10,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.isWon).toEqual(true);
          expect(res.body.guessedChampions).toEqual([5, 10]);
        });
    });

    it('should successfully submit MATCHER progress', () => {
      const matcherChallenge = new DailyChallengeEntity({
        id: 2,
        mode: Mode.MATCHER,
        matcherChampions: [1,2,3],
      });
      mockDailyChallengeRepository.findById.mockResolvedValue(matcherChallenge);
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
      mockUserRepository.update.mockResolvedValue({ ...mockUser, streak: 1 } as any);

      return request(app.getHttpServer())
        .post('/user-progress/user-1/2/guess')
        .send({
          isWon: true,
          moves: 30,
          timeElapsed: 120,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.isWon).toEqual(true);
          expect(res.body.moves).toEqual(30);
          expect(res.body.timeElapsed).toEqual(120);
        });
    });
  });
});
