import {
  UpdateUsuarioInput,
  Usuario,
} from "../entities/usuario.entity";
import { UsuariosRepository } from "../repositories/usuarios.repository";

export class UpdateUsuarioUseCase {
  constructor(private readonly repository: UsuariosRepository) {}

  execute(input: UpdateUsuarioInput): Promise<Usuario> {
    return this.repository.updateUsuario(input);
  }
}
