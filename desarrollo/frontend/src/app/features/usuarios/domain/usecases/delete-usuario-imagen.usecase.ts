import { Usuario } from "../entities/usuario.entity";
import { UsuariosRepository } from "../repositories/usuarios.repository";

export class DeleteUsuarioImagenUseCase {
  constructor(private readonly repository: UsuariosRepository) {}

  execute(id: string): Promise<Usuario> {
    return this.repository.deleteUsuarioImagen(id);
  }
}
