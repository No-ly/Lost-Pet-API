import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  // Mock: el controller solo debe delegar en AuthService, no probamos su lógica aquí
  const authService = { login: jest.fn(), register: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get(AuthController);
  });

  it('login envuelve el token en el formato de respuesta de la API', async () => {
    authService.login.mockResolvedValue('jwt-falso');

    const res = await controller.login({ email: 'a@a.com', password: '123' });

    expect(authService.login).toHaveBeenCalledWith('a@a.com', '123');
    expect(res).toEqual({
      status: 200,
      error: false,
      errorMessage: undefined,
      data: { token: 'jwt-falso' },
    });
  });

  it('register devuelve el token del usuario nuevo', async () => {
    authService.register.mockResolvedValue('jwt-nuevo');

    const res = await controller.register({} as any);

    expect(res.data).toEqual({ token: 'jwt-nuevo' });
  });
});
