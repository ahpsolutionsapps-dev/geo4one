import { ModuloCatalogItem, Rol } from "../../domain/entities/rol.entity";

export interface RolListApiModel {
  idRol: number;
  idNegocio: number;
  rol: string;
  descripcion: string;
  anulado?: boolean;
  modulosCount?: number;
}

export interface RolDetailApiModel {
  idRol: number;
  idNegocio: number;
  rol: string;
  descripcion: string;
  anulado: boolean;
  idModulos: number[];
  comentario: string | null;
}

export interface ModuloCatalogApiModel {
  idModulo: number;
  codigo: string | null;
  nombreModulo: string;
  icono: string | null;
  ruta: string | null;
  idPadre: number | null;
  orderIndex: number;
  oculto?: boolean;
}

export function mapRolListFromApi(model: RolListApiModel): Rol {
  return {
    id: String(model.idRol),
    idNegocio: model.idNegocio,
    rol: model.rol,
    descripcion: model.descripcion,
    anulado: model.anulado === true,
    modulosCount: model.modulosCount ?? 0,
    idModulos: [],
    comentario: null,
  };
}

export function mapRolDetailFromApi(model: RolDetailApiModel): Rol {
  return {
    id: String(model.idRol),
    idNegocio: model.idNegocio,
    rol: model.rol,
    descripcion: model.descripcion,
    anulado: model.anulado === true,
    modulosCount: model.idModulos?.length ?? 0,
    idModulos: model.idModulos ?? [],
    comentario: model.comentario ?? null,
  };
}

export function mapModuloCatalogFromApi(
  model: ModuloCatalogApiModel,
): ModuloCatalogItem {
  return {
    idModulo: model.idModulo,
    codigo: model.codigo,
    nombreModulo: model.nombreModulo,
    icono: model.icono,
    ruta: model.ruta,
    idPadre: model.idPadre,
    orderIndex: model.orderIndex,
    oculto: model.oculto === true,
  };
}
