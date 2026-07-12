import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DAILY_CHALLENGE_REPOSITORY } from './../src/core/daily-challenge/repositories/daily-challenge.repository.interface';
import { DailyChallengeEntity, Mode } from './../src/core/daily-challenge/entities/daily-challenge.entity';

describe('DailyChallengeController (e2e)', () => {
  let app: INestApplication<App>;

  const mockDailyChallengeRepository = {
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
      .overrideProvider(DAILY_CHALLENGE_REPOSITORY)
      .useValue(mockDailyChallengeRepository)
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

  const dummyDailyChallenge = new DailyChallengeEntity({
    id: 1,
    mode: Mode.CLASSIC,
    championsId: 10,
  });

  describe('/daily-challenges (POST)', () => {
    it('should create a daily challenge (Happy Path)', () => {
      mockDailyChallengeRepository.create.mockResolvedValue(dummyDailyChallenge);

      return request(app.getHttpServer())
        .post('/daily-challenges')
        .send({
          mode: Mode.CLASSIC,
          championsId: 10,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.mode).toEqual(Mode.CLASSIC);
          expect(res.body.championsId).toEqual(10);
        });
    });

    it('should return 400 Bad Request if missing required fields (Unhappy Path)', () => {
      return request(app.getHttpServer())
        .post('/daily-challenges')
        .send({
          mode: Mode.CLASSIC,
          // missing championsId
        })
        .expect(400);
    });
  });

  describe('/daily-challenges (GET)', () => {
    it('should return an array of daily challenges', () => {
      mockDailyChallengeRepository.findAll.mockResolvedValue([dummyDailyChallenge]);

      return request(app.getHttpServer())
        .get('/daily-challenges')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toEqual(dummyDailyChallenge.id);
        });
    });
  });

  describe('/daily-challenges/:id (GET)', () => {
    it('should return a daily challenge by id', () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(dummyDailyChallenge);

      return request(app.getHttpServer())
        .get(`/daily-challenges/${dummyDailyChallenge.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toEqual(dummyDailyChallenge.id);
        });
    });

    it('should return 404 if daily challenge not found', () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get(`/daily-challenges/999`)
        .expect(404);
    });
  });

  describe('/daily-challenges/:id (PATCH)', () => {
    it('should update a daily challenge', () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(dummyDailyChallenge);
      mockDailyChallengeRepository.update.mockResolvedValue(dummyDailyChallenge);

      return request(app.getHttpServer())
        .patch(`/daily-challenges/${dummyDailyChallenge.id}`)
        .send({ mode: Mode.JIGSAW })
        .expect(200);
    });
  });

  describe('/daily-challenges/:id (DELETE)', () => {
    it('should delete a daily challenge', () => {
      mockDailyChallengeRepository.findById.mockResolvedValue(dummyDailyChallenge);
      mockDailyChallengeRepository.delete.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .delete(`/daily-challenges/${dummyDailyChallenge.id}`)
        .expect(204);
    });
  });
});
