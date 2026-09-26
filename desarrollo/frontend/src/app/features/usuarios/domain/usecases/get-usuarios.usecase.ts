import { Usuario } from "../entities/usuario.entity";
import { UsuariosRepository } from "../repositories/usuarios.repository";

export class GetUsuariosUseCase {
  constructor(private readonly repository: UsuariosRepository) {}

  execute(): Promise<Usuario[]> {
    return this.repository.getUsuarios();
  }
}
