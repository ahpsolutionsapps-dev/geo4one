import { Rol } from "../entities/rol.entity";
import { RolesRepository } from "../repositories/roles.repository";

export class GetRolByIdUseCase {
  constructor(private readonly repository: RolesRepository) {}

  execute(id: string): Promise<Rol> {
    return this.repository.getRolById(id);
  }
}
