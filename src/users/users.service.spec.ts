import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const repo = {
    findOneBy: jest.fn(),
    create: jest.fn((x) => x),
    save: jest.fn(),
  };
  const dto = {
    name: 'S',
    lastName: 'M',
    email: 'a@a.com',
    password: 'secreta',
    isPetAlertEnabled: true,
    lat: 21.1,
    lon: -101.6,
    radius: 5,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('create guarda la contraseña hasheada y la ubicación como [lon, lat]', async () => {
    repo.findOneBy.mockResolvedValue(null);
    repo.save.mockImplementation(async (u) => ({ ...u, id: 9 }));

    await expect(service.create(dto)).resolves.toBe(9);

    const guardado = repo.save.mock.calls[0][0];
    expect(guardado.password).not.toBe('secreta');
    expect(await bcrypt.compare('secreta', guardado.password)).toBe(true);
    expect(guardado.location.coordinates).toEqual([-101.6, 21.1]);
  });

  it('create con email repetido lanza ConflictException y no guarda', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1 });

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('validate devuelve el id con la contraseña correcta y null con la incorrecta o sin usuario', async () => {
    const password = await bcrypt.hash('secreta', 4);
    repo.findOneBy.mockResolvedValue({ id: 4, password });

    await expect(service.validate('a@a.com', 'secreta')).resolves.toBe(4);
    await expect(service.validate('a@a.com', 'otra')).resolves.toBeNull();

    repo.findOneBy.mockResolvedValue(null);
    await expect(service.validate('x@x.com', 'secreta')).resolves.toBeNull();
  });
});
