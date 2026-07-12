import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { USER_REPOSITORY } from './../src/core/user/repositories/user.repository.interface';
import { UserEntity, Role, Rank } from './../src/core/user/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;

  const mockUserRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findTop500Users: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(USER_REPOSITORY)
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Simulate what's likely in main.ts
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

  const dummyUser = new UserEntity({
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    username: 'test_user',
    password: 'hashed_password',
    role: Role.USER,
    isActive: true,
    score: 100,
    rank: Rank.IRON,
    streak: 5,
    lastLogin: new Date('2024-01-01T00:00:00.000Z'),
    iconPath: 'path/to/icon.png',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  });

  describe('/users (POST)', () => {
    it('should create a user (Happy Path)', () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(dummyUser);

      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          username: 'test_user',
          password: 'Password123!',
          role: Role.USER,
          isActive: true,
          score: 0,
          rank: Rank.IRON,
          streak: 0,
          lastLogin: new Date().toISOString(),
          iconPath: 'path/to/icon.png',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toEqual('test@example.com');
          expect(res.body.username).toEqual('test_user');
          expect(res.body.password).toBeUndefined(); // Password should be stripped by Response DTO
        });
    });

    it('should return 409 Conflict if email exists (Unhappy Path)', () => {
      mockUserRepository.findByEmail.mockResolvedValue(dummyUser);

      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          username: 'test_user',
          password: 'Password123!',
          role: Role.USER,
          isActive: true,
          score: 0,
          rank: Rank.IRON,
          streak: 0,
          lastLogin: new Date().toISOString(),
          iconPath: 'path/to/icon.png',
        })
        .expect(409);
    });
  });

  describe('/users (GET)', () => {
    it('should return an array of users (Happy Path)', () => {
      mockUserRepository.findAll.mockResolvedValue([dummyUser]);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toEqual(dummyUser.id);
        });
    });
  });

  describe('/users/leaderboard (GET)', () => {
    it('should return leaderboard response (Happy Path)', () => {
      mockUserRepository.findTop500Users.mockResolvedValue([dummyUser]);

      return request(app.getHttpServer())
        .get('/users/leaderboard?page=1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body[0].username).toEqual(dummyUser.username);
          expect(res.body[0].score).toEqual(dummyUser.score);
          expect(res.body[0].email).toBeUndefined(); // Email must be excluded in leaderboard!
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id (Happy Path)', () => {
      mockUserRepository.findById.mockResolvedValue(dummyUser);

      return request(app.getHttpServer())
        .get(`/users/${dummyUser.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toEqual(dummyUser.id);
        });
    });

    it('should return 404 if user not found (Unhappy Path)', () => {
      mockUserRepository.findById.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get(`/users/${dummyUser.id}`)
        .expect(404);
    });

    it('should return 400 Bad Request if ID is not UUID (Edge Case)', () => {
      // ParseUUIDPipe should catch this before it hits the controller
      return request(app.getHttpServer())
        .get('/users/not-a-uuid-string')
        .expect(400); 
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should update a user (Happy Path)', () => {
      mockUserRepository.findById.mockResolvedValue(dummyUser);
      mockUserRepository.update.mockResolvedValue(dummyUser);

      return request(app.getHttpServer())
        .patch(`/users/${dummyUser.id}`)
        .send({ username: 'new_username' })
        .expect(200);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user (Happy Path)', () => {
      mockUserRepository.findById.mockResolvedValue(dummyUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .delete(`/users/${dummyUser.id}`)
        .expect(204);
    });
  });
});
