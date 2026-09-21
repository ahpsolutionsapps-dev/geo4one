import { httpClient } from "@/shared/api/http-client";

import {
  CreateUsuarioInput,
  UpdateUsuarioInput,
  Usuario,
} from "../../domain/entities/usuario.entity";
import { Rol } from "../../domain/entities/rol.entity";
import {
  mapRolFromApi,
  RolApiModel,
} from "../models/rol.model";
import {
  mapUsuarioFromApi,
  normalizeOptionalId,
  normalizeOptionalText,
  toApiFlag,
  UsuarioApiModel,
} from "../models/usuario.model";

interface UsuariosListResponse {
  items: UsuarioApiModel[];
}

interface UsuarioItemResponse {
  item: UsuarioApiModel;
}

interface RolesListResponse {
  items: RolApiModel[];
}

export class UsuariosRemoteDataSource {
  async getUsuarios(): Promise<Usuario[]> {
    const response = await httpClient.get<UsuariosListResponse>("/usuarios");

    return (response.data.items ?? []).map(mapUsuarioFromApi);
  }

  async getRoles(): Promise<Rol[]> {
    const response = await httpClient.get<RolesListResponse>("/roles");

    return (response.data.items ?? []).map(mapRolFromApi);
  }

  async createUsuario(input: CreateUsuarioInput): Promise<Usuario> {
    const response = await httpClient.post<UsuarioItemResponse>("/usuarios", {
      username: input.username.trim(),
      email: input.email.trim(),
      userpassword: input.userpassword,
      nombre: input.nombre?.trim(),
      apellido: normalizeOptionalText(input.apellido),
      telefono: normalizeOptionalText(input.telefono),
      idRol: normalizeOptionalId(input.idRol),
      palabraSecreta: normalizeOptionalText(input.palabraSecreta),
      habilitado: toApiFlag(input.habilitado ?? true),
      verificado: toApiFlag(input.verificado ?? false),
      estatus: input.estatus ?? 1,
      idioma: input.idioma,
      tema: input.tema,
      comentario: normalizeOptionalText(input.comentario),
    });

    return mapUsuarioFromApi(response.data.item);
  }

  async updateUsuario(input: UpdateUsuarioInput): Promise<Usuario> {
    const payload: Record<string, unknown> = {
      username: input.username.trim(),
      email: input.email.trim(),
      idRol: normalizeOptionalId(input.idRol ?? null),
      palabraSecreta: normalizeOptionalText(input.palabraSecreta),
      habilitado: toApiFlag(input.habilitado),
      verificado: toApiFlag(input.verificado),
      estatus: Number(input.estatus),
      comentario: normalizeOptionalText(input.comentario),
    };

    if (input.nombre !== undefined) {
      payload.nombre = input.nombre.trim();
    }
    if (input.apellido !== undefined) {
      payload.apellido = normalizeOptionalText(input.apellido);
    }
    if (input.telefono !== undefined) {
      payload.telefono = normalizeOptionalText(input.telefono);
    }
    if (input.idioma !== undefined) {
      payload.idioma = input.idioma;
    }
    if (input.tema !== undefined) {
      payload.tema = input.tema;
    }

    const password = input.userpassword?.trim();
    if (password) {
      payload.userpassword = password;
    }

    const response = await httpClient.patch<UsuarioItemResponse>(
      `/usuarios/${input.id}`,
      payload,
    );

    return mapUsuarioFromApi(response.data.item);
  }

  async anularUsuario(id: string): Promise<void> {
    await httpClient.delete(`/usuarios/${id}`);
  }

  async uploadUsuarioImagen(id: string, file: File): Promise<Usuario> {
    const formData = new FormData();
    formData.append("imagen", file);

    const response = await httpClient.post<UsuarioItemResponse>(
      `/usuarios/${id}/imagen`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return mapUsuarioFromApi(response.data.item);
  }

  async deleteUsuarioImagen(id: string): Promise<Usuario> {
    const response = await httpClient.delete<UsuarioItemResponse>(
      `/usuarios/${id}/imagen`,
    );

    return mapUsuarioFromApi(response.data.item);
  }
}
