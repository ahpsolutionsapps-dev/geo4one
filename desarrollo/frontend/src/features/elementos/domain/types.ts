export type ElementoStatus = "Activo" | "Inactivo" | "Anulado";

export interface Elemento {
  id?: string | number;
  idElemento?: number;
  elemento?: string;
  tipo?: string;
  formato?: string;
  tamaño?: string;
  proveedor?: string;
  ubicacion?: string;
  licencia?: string;
  costo?: number | string;
  status?: ElementoStatus;
  imagen?: string;
}

export interface ElementosFilters {
  q?: string;
  activo?: boolean;
  proveedor?: string;
  tipo?: string;
}
