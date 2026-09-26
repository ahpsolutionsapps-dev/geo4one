import { Usuario } from "../entities/usuario.entity";
import { UsuariosRepository } from "../repositories/usuarios.repository";

export interface UploadUsuarioImagenInput {
  id: string;
  file: File;
}

export class UploadUsuarioImagenUseCase {
  constructor(private readonly repository: UsuariosRepository) {}

  execute(input: UploadUsuarioImagenInput): Promise<Usuario> {
    return this.repository.uploadUsuarioImagen(input.id, input.file);
  }
}
