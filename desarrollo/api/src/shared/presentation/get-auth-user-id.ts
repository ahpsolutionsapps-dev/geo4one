import { Request } from 'express';
import { UnauthorizedError } from '../../core/errors/app-error';

export function getAuthUserId(req: Request): number {
  const sub = req.auth?.sub;
  if (!sub) {
    throw new UnauthorizedError();
  }

  const idUsuario = Number(sub);
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    throw new UnauthorizedError('Token inválido');
  }

  return idUsuario;
}
