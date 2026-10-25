import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LostPetsService } from './lost-pets.service';
import { LostPet } from './entities/lost-pet.entity';
import { CacheService } from '../cache/cache.service';

describe('LostPetsService', () => {
  let service: LostPetsService;
  const repo = { find: jest.fn(), create: jest.fn(), save: jest.fn() };
  const cache = { get: jest.fn(), set: jest.fn(), delete: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    repo.create.mockImplementation((x) => x);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LostPetsService,
        { provide: getRepositoryToken(LostPet), useValue: repo },
        { provide: CacheService, useValue: cache },
      ],
    }).compile();

    service = module.get(LostPetsService);
  });

  it('getAllPets: si está en caché no consulta la base', async () => {
    cache.get.mockResolvedValue([{ id: 1 }]);

    await expect(service.getAllPets()).resolves.toEqual([{ id: 1 }]);
    expect(repo.find).not.toHaveBeenCalled();
  });

  it('getAllPets: si no está en caché consulta la base y llena la caché', async () => {
    cache.get.mockResolvedValue(null);
    repo.find.mockResolvedValue([{ id: 2 }]);

    await expect(service.getAllPets()).resolves.toEqual([{ id: 2 }]);
    expect(cache.set).toHaveBeenCalledWith('lost-pets:all', [{ id: 2 }]);
  });

  it('createLostPet guarda con ubicación [lon, lat] e invalida la caché', async () => {
    repo.save.mockImplementation(async (p) => ({ ...p, id: 3 }));
    const dto: any = {
      type: 'Perro',
      name: 'Fido',
      phone: '1',
      race: 'x',
      age: 2,
      color: 'c',
      ownerName: 'o',
      lat: 21.1,
      lon: -101.6,
    };

    const res = await service.createLostPet(dto, 'https://img');

    expect(res.location).toEqual({
      type: 'Point',
      coordinates: [-101.6, 21.1],
    });
    expect(res.image).toBe('https://img');
    expect(cache.delete).toHaveBeenCalledWith('lost-pets:all');
  });
});
