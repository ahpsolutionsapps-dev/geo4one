import {
  CreateRolInput,
  ModuloCatalogItem,
  Rol,
  UpdateRolInput,
} from "../entities/rol.entity";

export interface RolesRepository {
  getRoles(includeAnulados?: boolean): Promise<Rol[]>;
  getRolById(id: string): Promise<Rol>;
  getModulosCatalog(): Promise<ModuloCatalogItem[]>;
  createRol(input: CreateRolInput): Promise<Rol>;
  updateRol(input: UpdateRolInput): Promise<Rol>;
  anularRol(id: string): Promise<void>;
}
