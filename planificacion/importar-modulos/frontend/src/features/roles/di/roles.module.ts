import { RolesRemoteDataSource } from "../data/datasources/roles-remote.datasource";
import { RolesRepositoryImpl } from "../data/repositories/roles.repository.impl";
import { AnularRolUseCase } from "../domain/usecases/anular-rol.usecase";
import { CreateRolUseCase } from "../domain/usecases/create-rol.usecase";
import { GetModulosCatalogUseCase } from "../domain/usecases/get-modulos-catalog.usecase";
import { GetRolByIdUseCase } from "../domain/usecases/get-rol-by-id.usecase";
import { GetRolesUseCase } from "../domain/usecases/get-roles.usecase";
import { UpdateRolUseCase } from "../domain/usecases/update-rol.usecase";

const remoteDataSource = new RolesRemoteDataSource();
const repository = new RolesRepositoryImpl(remoteDataSource);

export function buildRolesModule() {
  return {
    getRoles: new GetRolesUseCase(repository),
    getRolById: new GetRolByIdUseCase(repository),
    getModulosCatalog: new GetModulosCatalogUseCase(repository),
    createRol: new CreateRolUseCase(repository),
    updateRol: new UpdateRolUseCase(repository),
    anularRol: new AnularRolUseCase(repository),
  };
}

export type RolesModule = ReturnType<typeof buildRolesModule>;

export const rolesModule = buildRolesModule();
