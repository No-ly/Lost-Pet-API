import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const tokenService = { getUserId: jest.fn() };
  const guard = new AuthGuard(tokenService as any);

  // Arma un ExecutionContext mínimo con el header Authorization
  const contextWith = (authorization?: string) => {
    const request: any = { headers: { authorization } };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;
    return { context, request };
  };

  it('con token válido deja pasar y guarda el userId en el request', async () => {
    tokenService.getUserId.mockResolvedValue(5);
    const { context, request } = contextWith('Bearer abc');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(tokenService.getUserId).toHaveBeenCalledWith('abc');
    expect(request.userId).toBe(5);
  });

  it('si el token es inválido propaga el UnauthorizedException', async () => {
    tokenService.getUserId.mockRejectedValue(new UnauthorizedException());
    const { context } = contextWith('Bearer malo');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
