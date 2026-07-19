import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { CHAMPION_REPOSITORY } from './../src/core/champion/repositories/champion.repository.interface';
import { ChampionEntity, ChampionRole, DamageType, Gender, RangeType, Resource } from './../src/core/champion/entities/champion.entity';

describe('ChampionController (e2e)', () => {
  let app: INestApplication<App>;

  const mockChampionRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CHAMPION_REPOSITORY)
      .useValue(mockChampionRepository)
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

  const dummyChampion = new ChampionEntity({
    id: 1,
    name: 'Aatrox',
    gender: Gender.MALE,
    role: ChampionRole.TOP,
    damageType: DamageType.PHYSICAL,
    resource: Resource.MANALESS,
    rangeType: RangeType.MELEE,
    yearRelease: 2013,
    traits: ['Darkin', 'Fighter'],
    iconPath: 'path/to/icon.png',
    splashPath: ['path/to/splash.png'],
    hint: 'The Darkin Blade',
  });

  describe('/champions (POST)', () => {
    it('should create a champion (Happy Path)', () => {
      mockChampionRepository.create.mockResolvedValue(dummyChampion);

      return request(app.getHttpServer())
        .post('/champions')
        .send({
          name: 'Aatrox',
          gender: Gender.MALE,
          role: ChampionRole.TOP,
          damageType: DamageType.PHYSICAL,
          resource: Resource.MANALESS,
          rangeType: RangeType.MELEE,
          yearRelease: 2013,
          traits: ['Darkin', 'Fighter'],
          iconPath: 'path/to/icon.png',
          splashPath: ['path/to/splash.png'],
          hint: 'The Darkin Blade',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toEqual('Aatrox');
          expect(res.body.role).toEqual(ChampionRole.TOP);
        });
    });

    it('should return 400 Bad Request if missing required fields (Unhappy Path)', () => {
      return request(app.getHttpServer())
        .post('/champions')
        .send({
          name: 'Aatrox',
          // missing all other required fields
        })
        .expect(400);
    });
  });

  describe('/champions (GET)', () => {
    it('should return an array of champions', () => {
      mockChampionRepository.findAll.mockResolvedValue([dummyChampion]);

      return request(app.getHttpServer())
        .get('/champions')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toEqual(dummyChampion.id);
        });
    });
  });

  describe('/champions/:id (GET)', () => {
    it('should return a champion by id', () => {
      mockChampionRepository.findById.mockResolvedValue(dummyChampion);

      return request(app.getHttpServer())
        .get(`/champions/${dummyChampion.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toEqual(dummyChampion.id);
        });
    });

    it('should return 404 if champion not found', () => {
      mockChampionRepository.findById.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get(`/champions/999`)
        .expect(404);
    });
  });

  describe('/champions/name/:name (GET)', () => {
    it('should return a champion by name', () => {
      mockChampionRepository.findByName.mockResolvedValue(dummyChampion);

      return request(app.getHttpServer())
        .get(`/champions/name/${dummyChampion.name}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toEqual(dummyChampion.name);
        });
    });

    it('should return 404 if champion not found by name', () => {
      mockChampionRepository.findByName.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get(`/champions/name/Unknown`)
        .expect(404);
    });
  });

  describe('/champions/:id (PATCH)', () => {
    it('should update a champion', () => {
      mockChampionRepository.findById.mockResolvedValue(dummyChampion);
      mockChampionRepository.update.mockResolvedValue(dummyChampion);

      return request(app.getHttpServer())
        .patch(`/champions/${dummyChampion.id}`)
        .send({ name: 'New Aatrox' })
        .expect(200);
    });
  });

  describe('/champions/:id (DELETE)', () => {
    it('should delete a champion', () => {
      mockChampionRepository.findById.mockResolvedValue(dummyChampion);
      mockChampionRepository.delete.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .delete(`/champions/${dummyChampion.id}`)
        .expect(204);
    });
  });
});
