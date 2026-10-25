import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TokenService } from './token/token.service';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = { validate: jest.fn(), create: jest.fn() };
  const tokenService = { generate: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('login genera un token con el id del usuario válido', async () => {
    usersService.validate.mockResolvedValue(7);
    tokenService.generate.mockResolvedValue('tok');

    await expect(service.login('a@a.com', 'pw')).resolves.toBe('tok');
    expect(tokenService.generate).toHaveBeenCalledWith(7);
  });

  it('login con credenciales inválidas lanza BadRequestException y no genera token', async () => {
    usersService.validate.mockResolvedValue(null);

    await expect(service.login('a@a.com', 'mal')).rejects.toThrow(BadRequestException);
    expect(tokenService.generate).not.toHaveBeenCalled();
  });

  it('register crea el usuario y devuelve su token', async () => {
    usersService.create.mockResolvedValue(3);
    tokenService.generate.mockResolvedValue('tok-nuevo');

    await expect(service.register({} as any)).resolves.toBe('tok-nuevo');
    expect(tokenService.generate).toHaveBeenCalledWith(3);
  });
});
