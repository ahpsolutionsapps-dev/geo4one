import { RolesRepository } from "../repositories/roles.repository";

export class AnularRolUseCase {
  constructor(private readonly repository: RolesRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.anularRol(id);
  }
}
