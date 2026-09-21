import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { isSuperAdminRolName } from '../../../roles/domain/constants/roles.constants';
import { Usuario } from '../../domain/entities/usuario';
import { UsuarioRepository } from '../../domain/repositories/usuario-repository';

export function assertUsuarioVisibleToActor(
  usuario: Usuario,
  actorIsSuperAdmin: boolean,
): void {
  if (actorIsSuperAdmin) {
    return;
  }

  if (isSuperAdminRolName(usuario.toPrimitives().rol ?? '')) {
    throw new NotFoundError('Usuario no encontrado');
  }
}

export async function assertAssignableRolForActor(
  usuarios: UsuarioRepository,
  idRol: number | null | undefined,
  actorIsSuperAdmin: boolean,
): Promise<void> {
  if (actorIsSuperAdmin || idRol == null) {
    return;
  }

  const rolName = await usuarios.findRolNameById(idRol);
  if (rolName && isSuperAdminRolName(rolName)) {
    throw new ValidationError('No puedes asignar el rol Super Administrador');
  }
}
