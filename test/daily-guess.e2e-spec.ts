import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DAILY_GUESS_REPOSITORY } from './../src/core/daily-guess/repositories/daily-guess.repository.interface';
import { DailyGuessEntity } from './../src/core/daily-guess/entities/daily-guess.entity';

describe('DailyGuessController (e2e)', () => {
  let app: INestApplication<App>;

  const mockDailyGuessRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DAILY_GUESS_REPOSITORY)
      .useValue(mockDailyGuessRepository)
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

  const dummyDailyGuess = new DailyGuessEntity({
    id: 1,
    guessCount: 3,
    championsId: 5,
    dailyChallengeId: 10,
  });

  describe('/daily-guesses (POST)', () => {
    it('should create a daily guess (Happy Path)', () => {
      mockDailyGuessRepository.create.mockResolvedValue(dummyDailyGuess);

      return request(app.getHttpServer())
        .post('/daily-guesses')
        .send({
          guessCount: 3,
          championsId: 5,
          dailyChallengeId: 10,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.guessCount).toEqual(3);
          expect(res.body.championsId).toEqual(5);
        });
    });

    it('should return 400 Bad Request if missing required fields (Unhappy Path)', () => {
      return request(app.getHttpServer())
        .post('/daily-guesses')
        .send({
          guessCount: 3,
          // missing championsId and dailyChallengeId
        })
        .expect(400);
    });
  });

  describe('/daily-guesses (GET)', () => {
    it('should return an array of daily guesses', () => {
      mockDailyGuessRepository.findAll.mockResolvedValue([dummyDailyGuess]);

      return request(app.getHttpServer())
        .get('/daily-guesses')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toEqual(dummyDailyGuess.id);
        });
    });
  });

  describe('/daily-guesses/:id (GET)', () => {
    it('should return a daily guess by id', () => {
      mockDailyGuessRepository.findById.mockResolvedValue(dummyDailyGuess);

      return request(app.getHttpServer())
        .get(`/daily-guesses/${dummyDailyGuess.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toEqual(dummyDailyGuess.id);
        });
    });

    it('should return 404 if daily guess not found', () => {
      mockDailyGuessRepository.findById.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get(`/daily-guesses/999`)
        .expect(404);
    });
  });

  describe('/daily-guesses/:id (PATCH)', () => {
    it('should update a daily guess', () => {
      mockDailyGuessRepository.findById.mockResolvedValue(dummyDailyGuess);
      mockDailyGuessRepository.update.mockResolvedValue(dummyDailyGuess);

      return request(app.getHttpServer())
        .patch(`/daily-guesses/${dummyDailyGuess.id}`)
        .send({ guessCount: 5 })
        .expect(200);
    });
  });

  describe('/daily-guesses/:id (DELETE)', () => {
    it('should delete a daily guess', () => {
      mockDailyGuessRepository.findById.mockResolvedValue(dummyDailyGuess);
      mockDailyGuessRepository.delete.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .delete(`/daily-guesses/${dummyDailyGuess.id}`)
        .expect(204);
    });
  });
});
