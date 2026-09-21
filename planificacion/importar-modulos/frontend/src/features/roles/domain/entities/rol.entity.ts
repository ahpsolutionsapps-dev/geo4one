export interface Rol {
  id: string;
  idNegocio: number;
  rol: string;
  descripcion: string;
  anulado: boolean;
  modulosCount: number;
  idModulos: number[];
  comentario: string | null;
}

export interface CreateRolInput {
  rol: string;
  descripcion: string;
  idModulos: number[];
}

export interface UpdateRolInput {
  id: string;
  rol: string;
  descripcion: string;
  idModulos: number[];
  comentario?: string | null;
}

export interface ModuloCatalogItem {
  idModulo: number;
  codigo: string | null;
  nombreModulo: string;
  icono: string | null;
  ruta: string | null;
  idPadre: number | null;
  orderIndex: number;
  oculto: boolean;
}

export const SUPER_ADMIN_ROL_NAME = "Super Administrador";

export function isSuperAdminRol(rol: Pick<Rol, "rol">): boolean {
  return rol.rol.trim().toLowerCase() === SUPER_ADMIN_ROL_NAME.toLowerCase();
}

export function isModuloVisible(modulo: Pick<ModuloCatalogItem, "oculto">): boolean {
  return modulo.oculto !== true;
}

export function visibleModulosCatalog(
  modulos: ModuloCatalogItem[],
): ModuloCatalogItem[] {
  return modulos.filter(isModuloVisible);
}

export function assignableModuloIds(
  selected: number[] | undefined,
  catalog: ModuloCatalogItem[],
): number[] {
  const catalogIds = new Set(catalog.map((item) => item.idModulo));
  return (selected ?? []).filter((id) => catalogIds.has(id));
}

export function moduloCatalogLabel(modulo: ModuloCatalogItem): string {
  return modulo.oculto ? `${modulo.nombreModulo} (Oculto)` : modulo.nombreModulo;
}
