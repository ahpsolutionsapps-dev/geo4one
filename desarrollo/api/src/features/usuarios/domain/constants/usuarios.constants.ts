import { ValidationError } from '../../../../core/errors/app-error';

export const PROTECTED_USUARIO_ID = 1;

export function assertUsuarioMutable(idUsuario: number): void {
  if (idUsuario === PROTECTED_USUARIO_ID) {
    throw new ValidationError('El usuario administrador no puede modificarse');
  }
}
