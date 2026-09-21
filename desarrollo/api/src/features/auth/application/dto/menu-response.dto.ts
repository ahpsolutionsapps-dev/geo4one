export interface MenuItemDto {
  id: string;
  title: string;
  iconKey: string;
  path: string | null;
}

export interface MenuSectionDto {
  id: string;
  title: string;
  sectionIconKey: string;
  path: string | null;
  items: MenuItemDto[];
}

export interface MenuModuleDto {
  idModulo: number;
  codigo: string | null;
  nombreModulo: string;
  icono: string | null;
  ruta: string | null;
  idPadre: number | null;
  orderIndex: number;
}

export interface MenuResponseDto {
  sections: MenuSectionDto[];
  /** Módulos asignados al rol (incluye ancestros) para sincronizar tablas locales. */
  modules: MenuModuleDto[];
  idRol: number | null;
}
