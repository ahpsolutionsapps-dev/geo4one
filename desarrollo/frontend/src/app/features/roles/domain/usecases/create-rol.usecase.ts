import { CreateRolInput, Rol } from "../entities/rol.entity";
import { RolesRepository } from "../repositories/roles.repository";

export class CreateRolUseCase {
  constructor(private readonly repository: RolesRepository) {}

  execute(input: CreateRolInput): Promise<Rol> {
    return this.repository.createRol(input);
  }
}
