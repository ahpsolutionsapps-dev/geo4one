import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../../../core/errors/app-error';
import { UserRepository } from '../../domain/repositories/user-repository';

export function requireVerifiedMiddleware(users: UserRepository) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const sub = req.auth?.sub;
      if (!sub) {
        next(new UnauthorizedError('Token no provisto'));
        return;
      }

      const idUsuario = Number(sub);
      if (!Number.isFinite(idUsuario)) {
        next(new UnauthorizedError('Token inválido'));
        return;
      }

      const user = await users.findById(idUsuario);
      if (!user) {
        next(new UnauthorizedError());
        return;
      }

      if (user.anulado) {
        next(
          new ForbiddenError(
            'Tu cuenta ha sido anulada. Contacta al administrador.',
            'ACCOUNT_ANNULLED',
          ),
        );
        return;
      }

      if (!user.habilitado) {
        next(
          new ForbiddenError(
            'Tu cuenta está deshabilitada. Contacta al administrador.',
            'ACCOUNT_DISABLED',
          ),
        );
        return;
      }

      if (user.verificado !== true) {
        next(
          new ForbiddenError(
            'Tu cuenta no está verificada. Contacta al administrador para habilitar el acceso.',
            'ACCOUNT_NOT_VERIFIED',
          ),
        );
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
