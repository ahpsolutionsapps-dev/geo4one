import { Rol } from "../entities/rol.entity";
import { RolesRepository } from "../repositories/roles.repository";

export class GetRolesUseCase {
  constructor(private readonly repository: RolesRepository) {}

  execute(includeAnulados = false): Promise<Rol[]> {
    return this.repository.getRoles(includeAnulados);
  }
}
