import { Rol, UpdateRolInput } from "../entities/rol.entity";
import { RolesRepository } from "../repositories/roles.repository";

export class UpdateRolUseCase {
  constructor(private readonly repository: RolesRepository) {}

  execute(input: UpdateRolInput): Promise<Rol> {
    return this.repository.updateRol(input);
  }
}
