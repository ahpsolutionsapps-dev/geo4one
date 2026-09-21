import { NotFoundError } from '../../../../core/errors/app-error';
import { uploadEntityImagen } from '../../../../shared/application/entity-imagen.service';
import { UploadServiceClient } from '../../../../shared/infrastructure/upload-service/upload-service.types';
import { assertUsuarioMutable } from '../../domain/constants/usuarios.constants';
import { assertUsuarioVisibleToActor } from '../helpers/hide-super-admin-usuario';
import { UsuarioResponse, toUsuarioResponse } from '../mappers/usuario-response.mapper';
import { UsuarioRepository } from '../../domain/repositories/usuario-repository';

export interface UploadUsuarioImagenInput {
  idUsuario: number;
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  idUsuarioModifica: number;
  actorIsSuperAdmin?: boolean;
}

export class UploadUsuarioImagenUseCase {
  constructor(
    private readonly usuarios: UsuarioRepository,
    private readonly uploadService: UploadServiceClient,
  ) {}

  async execute(input: UploadUsuarioImagenInput): Promise<UsuarioResponse> {
    assertUsuarioMutable(input.idUsuario);

    const usuario = await this.usuarios.findById(input.idUsuario);
    if (!usuario || usuario.anulado) {
      throw new NotFoundError('Usuario no encontrado');
    }

    assertUsuarioVisibleToActor(usuario, input.actorIsSuperAdmin === true);

    const url = await uploadEntityImagen(this.uploadService, {
      buffer: input.buffer,
      originalName: input.originalName,
      mimeType: input.mimeType,
      currentImagenUrl: usuario.imagen,
      category: 'usuarios',
      tag: `usuario-${input.idUsuario}`,
    });

    const updated = await this.usuarios.update(input.idUsuario, {
      imagen: url,
      idUsuarioModifica: input.idUsuarioModifica,
    });

    return toUsuarioResponse(updated.toPrimitives());
  }
}
