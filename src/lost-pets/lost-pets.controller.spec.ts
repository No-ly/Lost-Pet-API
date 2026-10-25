import { Test, TestingModule } from '@nestjs/testing';
import { LostPetsController } from './lost-pets.controller';
import { LostPetsService } from './lost-pets.service';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { AuthGuard } from '../auth/auth.guard';

describe('LostPetsController', () => {
  let controller: LostPetsController;
  const lostPetsService = { getAllPets: jest.fn(), createLostPet: jest.fn() };
  const emailService = { sendEmail: jest.fn() };
  const storageService = { uploadFile: jest.fn() };
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

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LostPetsController],
      providers: [
        { provide: LostPetsService, useValue: lostPetsService },
        { provide: EmailService, useValue: emailService },
        { provide: StorageService, useValue: storageService },
      ],
    })
      // El guard se prueba aparte (auth.guard.spec.ts); aquí lo dejamos pasar
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(LostPetsController);
  });

  it('getAllLostPets devuelve las mascotas en el formato de la API', async () => {
    lostPetsService.getAllPets.mockResolvedValue([{ id: 1 }]);

    await expect(controller.getAllLostPets()).resolves.toMatchObject({
      status: 200,
      error: false,
      data: [{ id: 1 }],
    });
  });

  it('createLostPet sube la imagen, manda el correo y guarda con la URL', async () => {
    storageService.uploadFile.mockResolvedValue('https://img');
    lostPetsService.createLostPet.mockResolvedValue({ id: 5 });

    const res = await controller.createLostPet(dto, { originalname: 'a.png' });

    expect(storageService.uploadFile).toHaveBeenCalledWith(
      { originalname: 'a.png' },
      'pets',
    );
    expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
    expect(lostPetsService.createLostPet).toHaveBeenCalledWith(dto, 'https://img');
    expect(res).toMatchObject({ status: 200, error: false, data: { id: 5 } });
  });

  it('createLostPet: si el correo falla responde 500 y NO guarda la mascota', async () => {
    storageService.uploadFile.mockResolvedValue('https://img');
    emailService.sendEmail.mockRejectedValue(new Error('smtp'));

    const res = await controller.createLostPet(dto, {});

    expect(res).toMatchObject({ status: 500, error: true });
    expect(lostPetsService.createLostPet).not.toHaveBeenCalled();
  });
});
