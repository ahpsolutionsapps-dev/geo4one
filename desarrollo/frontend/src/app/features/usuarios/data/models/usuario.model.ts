import { Usuario } from "../../domain/entities/usuario.entity";

export interface UsuarioApiModel {
  idUsuario: number;
  idNegocio: number;
  username: string;
  email: string;
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;
  idRol: number | null;
  rol?: string | null;
  palabraSecreta?: string | null;
  habilitado: boolean | number | null;
  imagen: string | null;
  verificado: boolean | number | null;
  estatus: number | null;
  idioma?: string;
  tema?: string;
  comentario: string | null;
  fechaCreacion?: string | null;
  fechaModificacion?: string | null;
}

function toBoolean(
  value: boolean | number | null | undefined,
  defaultValue = false,
): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === 1;
}

export function mapUsuarioFromApi(model: UsuarioApiModel): Usuario {
  return {
    id: String(model.idUsuario),
    idNegocio: model.idNegocio,
    username: model.username,
    email: model.email,
    nombre: model.nombre,
    apellido: model.apellido?.trim() || null,
    telefono: model.telefono?.trim() || null,
    idRol: model.idRol === null ? null : String(model.idRol),
    rolNombre: model.rol?.trim() || null,
    palabraSecreta: model.palabraSecreta?.trim() || null,
    habilitado: toBoolean(model.habilitado, true),
    imagen: model.imagen,
    verificado: toBoolean(model.verificado, false),
    estatus: model.estatus ?? 1,
    idioma: model.idioma ?? "es",
    tema: model.tema ?? "sistema",
    comentario: model.comentario,
    fechaCreacion: model.fechaCreacion ?? null,
    fechaModificacion: model.fechaModificacion ?? null,
  };
}

export function normalizeOptionalText(
  value?: string | null,
): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed;
}

export function normalizeOptionalId(
  value?: string | null,
): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  return Number(trimmed);
}

export function toApiFlag(value?: boolean): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value ? 1 : 0;
}
