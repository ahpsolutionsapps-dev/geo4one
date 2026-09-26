import { Rol } from "../entities/rol.entity";
import { UsuariosRepository } from "../repositories/usuarios.repository";

export class GetRolesUseCase {
  constructor(private readonly repository: UsuariosRepository) {}

  execute(): Promise<Rol[]> {
    return this.repository.getRoles();
  }
}
