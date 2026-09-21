import { ConflictError } from '../../../../core/errors/app-error';
import { PasswordHasher } from '../../../auth/domain/services/password-hasher';
import { assertAssignableRolForActor } from '../helpers/hide-super-admin-usuario';
import { UsuarioResponse, toUsuarioResponse } from '../mappers/usuario-response.mapper';
import {
  CreateUsuarioInput,
  UsuarioRepository,
} from '../../domain/repositories/usuario-repository';

export class CreateUsuarioUseCase {
  constructor(
    private readonly usuarios: UsuarioRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(
    input: CreateUsuarioInput & { actorIsSuperAdmin?: boolean },
  ): Promise<UsuarioResponse> {
    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();

    await assertAssignableRolForActor(
      this.usuarios,
      input.idRol,
      input.actorIsSuperAdmin === true,
    );

    const existingUsername = await this.usuarios.findByUsername(username);
    if (existingUsername && !existingUsername.anulado) {
      throw new ConflictError('Ya existe un usuario con ese nombre');
    }

    const existingEmail = await this.usuarios.findByEmail(email);
    if (existingEmail && !existingEmail.anulado) {
      throw new ConflictError('Ya existe un usuario con ese correo');
    }

    const { actorIsSuperAdmin: _actorIsSuperAdmin, ...createInput } = input;
    const userpassword = await this.hasher.hash(input.userpassword);
    const usuario = await this.usuarios.create({
      ...createInput,
      username,
      email,
      userpassword,
      palabraSecreta: input.palabraSecreta?.trim() || null,
      comentario: input.comentario?.trim() || null,
    });

    return toUsuarioResponse(usuario.toPrimitives());
  }
}
