import {
  CreateRolInput,
  ModuloCatalogItem,
  Rol,
  UpdateRolInput,
} from "../../domain/entities/rol.entity";
import { RolesRepository } from "../../domain/repositories/roles.repository";
import { RolesRemoteDataSource } from "../datasources/roles-remote.datasource";

export class RolesRepositoryImpl implements RolesRepository {
  constructor(private readonly remote: RolesRemoteDataSource) {}

  getRoles(includeAnulados?: boolean): Promise<Rol[]> {
    return this.remote.getRoles(includeAnulados);
  }

  getRolById(id: string): Promise<Rol> {
    return this.remote.getRolById(id);
  }

  getModulosCatalog(): Promise<ModuloCatalogItem[]> {
    return this.remote.getModulosCatalog();
  }

  createRol(input: CreateRolInput): Promise<Rol> {
    return this.remote.createRol(input);
  }

  updateRol(input: UpdateRolInput): Promise<Rol> {
    return this.remote.updateRol(input);
  }

  anularRol(id: string): Promise<void> {
    return this.remote.anularRol(id);
  }
}
