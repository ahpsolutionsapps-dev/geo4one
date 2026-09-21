import { httpClient } from "@/shared/api/http-client";

import {
  CreateRolInput,
  ModuloCatalogItem,
  Rol,
  UpdateRolInput,
} from "../../domain/entities/rol.entity";
import {
  mapModuloCatalogFromApi,
  mapRolDetailFromApi,
  mapRolListFromApi,
  ModuloCatalogApiModel,
  RolDetailApiModel,
  RolListApiModel,
} from "../models/rol.model";

interface RolesListResponse {
  items: RolListApiModel[];
}

interface RolItemResponse {
  item: RolDetailApiModel;
}

interface ModulosCatalogResponse {
  items: ModuloCatalogApiModel[];
}

export class RolesRemoteDataSource {
  async getRoles(includeAnulados = false): Promise<Rol[]> {
    const response = await httpClient.get<RolesListResponse>("/roles", {
      params: includeAnulados ? { includeAnulados: true } : undefined,
    });
    return (response.data.items ?? []).map(mapRolListFromApi);
  }

  async getRolById(id: string): Promise<Rol> {
    const response = await httpClient.get<RolItemResponse>(`/roles/${id}`);
    return mapRolDetailFromApi(response.data.item);
  }

  async getModulosCatalog(): Promise<ModuloCatalogItem[]> {
    const response = await httpClient.get<ModulosCatalogResponse>(
      "/roles/modulos",
    );
    return (response.data.items ?? []).map(mapModuloCatalogFromApi);
  }

  async createRol(input: CreateRolInput): Promise<Rol> {
    const response = await httpClient.post<RolItemResponse>("/roles", {
      rol: input.rol.trim(),
      descripcion: input.descripcion.trim(),
      idModulos: input.idModulos,
    });
    return mapRolDetailFromApi(response.data.item);
  }

  async updateRol(input: UpdateRolInput): Promise<Rol> {
    const response = await httpClient.patch<RolItemResponse>(
      `/roles/${input.id}`,
      {
        rol: input.rol.trim(),
        descripcion: input.descripcion.trim(),
        idModulos: input.idModulos,
        comentario: input.comentario ?? null,
      },
    );
    return mapRolDetailFromApi(response.data.item);
  }

  async anularRol(id: string): Promise<void> {
    await httpClient.delete(`/roles/${id}`);
  }
}
