import { PrismaClient } from '@prisma/client';
import { isSuperAdminRolName } from '../../domain/constants/roles.constants';

export async function isSuperAdminUser(
  prisma: PrismaClient,
  idUsuario: number,
): Promise<boolean> {
  const row = await prisma.usuario.findUnique({
    where: { idUsuario },
    select: { rol: { select: { rol: true } } },
  });

  return isSuperAdminRolName(row?.rol?.rol ?? '');
}
