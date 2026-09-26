import { ModuloCatalogItem } from "../entities/rol.entity";
import { RolesRepository } from "../repositories/roles.repository";

export class GetModulosCatalogUseCase {
  constructor(private readonly repository: RolesRepository) {}

  execute(): Promise<ModuloCatalogItem[]> {
    return this.repository.getModulosCatalog();
  }
}
