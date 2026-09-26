import { UsuariosRepository } from "../repositories/usuarios.repository";

export class AnularUsuarioUseCase {
  constructor(private readonly repository: UsuariosRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.anularUsuario(id);
  }
}
