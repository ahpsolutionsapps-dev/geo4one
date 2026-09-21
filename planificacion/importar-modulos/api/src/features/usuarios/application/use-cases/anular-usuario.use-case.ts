import { NotFoundError } from '../../../../core/errors/app-error';
import { assertUsuarioMutable } from '../../domain/constants/usuarios.constants';
import { assertUsuarioVisibleToActor } from '../helpers/hide-super-admin-usuario';
import { UsuarioRepository } from '../../domain/repositories/usuario-repository';

export class AnularUsuarioUseCase {
  constructor(private readonly usuarios: UsuarioRepository) {}

  async execute(
    idUsuario: number,
    idUsuarioAnula: number,
    options?: { actorIsSuperAdmin?: boolean },
  ): Promise<void> {
    assertUsuarioMutable(idUsuario);

    const existing = await this.usuarios.findById(idUsuario);
    if (!existing) {
      throw new NotFoundError('Usuario no encontrado');
    }

    assertUsuarioVisibleToActor(existing, options?.actorIsSuperAdmin === true);

    if (existing.anulado) {
      return;
    }

    await this.usuarios.softDelete(idUsuario, idUsuarioAnula);
  }
}
