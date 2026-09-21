import { NotFoundError } from '../../../../core/errors/app-error';
import { assertUsuarioVisibleToActor } from '../helpers/hide-super-admin-usuario';
import { UsuarioResponse, toUsuarioResponse } from '../mappers/usuario-response.mapper';
import { UsuarioRepository } from '../../domain/repositories/usuario-repository';

export class GetUsuarioByIdUseCase {
  constructor(private readonly usuarios: UsuarioRepository) {}

  async execute(
    idUsuario: number,
    options?: { actorIsSuperAdmin?: boolean },
  ): Promise<UsuarioResponse> {
    const usuario = await this.usuarios.findById(idUsuario);
    if (!usuario || usuario.anulado) {
      throw new NotFoundError('Usuario no encontrado');
    }

    assertUsuarioVisibleToActor(usuario, options?.actorIsSuperAdmin === true);

    return toUsuarioResponse(usuario.toPrimitives());
  }
}
