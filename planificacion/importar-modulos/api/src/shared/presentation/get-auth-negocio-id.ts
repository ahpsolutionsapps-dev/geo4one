import { Request } from 'express';
import { prisma } from '../../core/database/prisma';
import { NotFoundError } from '../../core/errors/app-error';
import { getAuthUserId } from './get-auth-user-id';

export async function getAuthNegocioId(req: Request): Promise<number> {
  const idUsuario = getAuthUserId(req);
  const user = await prisma.usuario.findUnique({
    where: { idUsuario },
    select: { idNegocio: true },
  });

  if (!user?.idNegocio) {
    throw new NotFoundError('Negocio del usuario no encontrado');
  }

  return user.idNegocio;
}
