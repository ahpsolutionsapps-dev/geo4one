import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../../../core/errors/app-error';
import { isPrivilegedDashboardRolId } from '../../../roles/domain/constants/roles.constants';
import { UserRepository } from '../../domain/repositories/user-repository';

export function requirePrivilegedDashboardRolMiddleware(users: UserRepository) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const sub = req.auth?.sub;
      if (!sub) {
        next(new UnauthorizedError('Token no provisto'));
        return;
      }

      const idUsuario = Number(sub);
      if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        next(new UnauthorizedError('Token inválido'));
        return;
      }

      const user = await users.findById(idUsuario);
      if (!user || !isPrivilegedDashboardRolId(user.idRol)) {
        next(new ForbiddenError('Acceso restringido al dashboard completo'));
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
