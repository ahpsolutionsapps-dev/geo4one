import { ConflictError, NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { PasswordHasher } from '../../../auth/domain/services/password-hasher';
import { assertUsuarioMutable } from '../../domain/constants/usuarios.constants';
import { assertAssignableRolForActor, assertUsuarioVisibleToActor } from '../helpers/hide-super-admin-usuario';
import { UsuarioResponse, toUsuarioResponse } from '../mappers/usuario-response.mapper';
import {
  UpdateUsuarioInput,
  UsuarioRepository,
} from '../../domain/repositories/usuario-repository';

export class UpdateUsuarioUseCase {
  constructor(
    private readonly usuarios: UsuarioRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(
    idUsuario: number,
    input: Omit<UpdateUsuarioInput, 'idUsuarioModifica' | 'userpassword'> & {
      userpassword?: string | null;
      idUsuarioModifica: number;
      actorIsSuperAdmin?: boolean;
    },
  ): Promise<UsuarioResponse> {
    assertUsuarioMutable(idUsuario);

    const existing = await this.usuarios.findById(idUsuario);
    if (!existing || existing.anulado) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const actorIsSuperAdmin = input.actorIsSuperAdmin === true;
    assertUsuarioVisibleToActor(existing, actorIsSuperAdmin);
    await assertAssignableRolForActor(this.usuarios, input.idRol, actorIsSuperAdmin);

    const username = input.username?.trim();
    if (username && username !== existing.toPrimitives().username) {
      const duplicate = await this.usuarios.findByUsername(username);
      if (duplicate && duplicate.idUsuario !== idUsuario && !duplicate.anulado) {
        throw new ConflictError('Ya existe un usuario con ese nombre');
      }
    }

    const email = input.email?.trim().toLowerCase();
    if (email && email !== existing.toPrimitives().email) {
      const duplicate = await this.usuarios.findByEmail(email);
      if (duplicate && duplicate.idUsuario !== idUsuario && !duplicate.anulado) {
        throw new ConflictError('Ya existe un usuario con ese correo');
      }
    }

    let userpassword: string | undefined;
    const plainPassword = input.userpassword?.trim();
    if (plainPassword) {
      if (plainPassword.length < 6) {
        throw new ValidationError('La contrasena debe tener al menos 6 caracteres');
      }
      userpassword = await this.hasher.hash(plainPassword);
    }

    const updated = await this.usuarios.update(idUsuario, {
      username,
      email,
      userpassword,
      idRol: input.idRol,
      palabraSecreta:
        input.palabraSecreta !== undefined
          ? input.palabraSecreta?.trim() || null
          : undefined,
      habilitado: input.habilitado,
      verificado: input.verificado,
      estatus: input.estatus,
      comentario:
        input.comentario !== undefined
          ? input.comentario?.trim() || null
          : undefined,
      idUsuarioModifica: input.idUsuarioModifica,
    });

    return toUsuarioResponse(updated.toPrimitives());
  }
}
