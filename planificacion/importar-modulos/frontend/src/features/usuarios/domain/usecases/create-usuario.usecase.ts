import {
  CreateUsuarioInput,
  Usuario,
} from "../entities/usuario.entity";
import { UsuariosRepository } from "../repositories/usuarios.repository";

export class CreateUsuarioUseCase {
  constructor(private readonly repository: UsuariosRepository) {}

  execute(input: CreateUsuarioInput): Promise<Usuario> {
    return this.repository.createUsuario(input);
  }
}
