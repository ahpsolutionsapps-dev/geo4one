import { NotFoundError } from '../../../../core/errors/app-error';
import { deleteEntityImagenFile } from '../../../../shared/application/entity-imagen.service';
import { UploadServiceClient } from '../../../../shared/infrastructure/upload-service/upload-service.types';
import { assertUsuarioMutable } from '../../domain/constants/usuarios.constants';
import { assertUsuarioVisibleToActor } from '../helpers/hide-super-admin-usuario';
import { UsuarioResponse, toUsuarioResponse } from '../mappers/usuario-response.mapper';
import { UsuarioRepository } from '../../domain/repositories/usuario-repository';

export class DeleteUsuarioImagenUseCase {
  constructor(
    private readonly usuarios: UsuarioRepository,
    private readonly uploadService: UploadServiceClient,
  ) {}

  async execute(
    idUsuario: number,
    idUsuarioModifica: number,
    options?: { actorIsSuperAdmin?: boolean },
  ): Promise<UsuarioResponse> {
    assertUsuarioMutable(idUsuario);

    const usuario = await this.usuarios.findById(idUsuario);
    if (!usuario || usuario.anulado) {
      throw new NotFoundError('Usuario no encontrado');
    }

    assertUsuarioVisibleToActor(usuario, options?.actorIsSuperAdmin === true);

    await deleteEntityImagenFile(this.uploadService, usuario.imagen);

    const updated = await this.usuarios.update(idUsuario, {
      imagen: null,
      idUsuarioModifica,
    });

    return toUsuarioResponse(updated.toPrimitives());
  }
}
