export interface Elemento {
  idElemento: number;
  idProveedor: number;
  licencia: string | null;
  fechaEmision: string | null;
  fechaVencimiento: string | null;
  idSeguimiento: string | null;
  idTipoElemento: number;
  idFormato: number | null;
  idTamano: number | null;
  activo: boolean;
  costoAlquiler: number | string | null;
  direccion: string | null;
  idOrientacion: number | null;
  idProvincia: number | null;
  idMunicipio: number | null;
  idSectorBarrio: number | null;
  circunscripcion: string | null;
  latitud: number | string | null;
  longitud: number | string | null;
  anulado: boolean;
  comentarioAnulado: string | null;
  fechaAnulacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
  imagenUrl: string | null;
}

export interface ElementoFormValues {
  idProveedor: string;
  idTipoElemento: string;
  idFormato: string;
  idTamano: string;
  activo: boolean;
  licencia: string;
  fechaEmision: string;
  fechaVencimiento: string;
  idSeguimiento: string;
  direccion: string;
  idProvincia: string;
  idMunicipio: string;
  idSectorBarrio: string;
  circunscripcion: string;
  idOrientacion: string;
  latitud: string;
  longitud: string;
  costoAlquiler: string;
  imagenUrl: string;
}

export interface OptionItem {
  label: string;
  value: string;
}

export interface FormatoOption extends OptionItem {
  idTipoElemento: string;
}

export interface MunicipioOption extends OptionItem {
  idProvincia: string;
}

export interface SectorOption extends OptionItem {
  idMunicipio: string;
}

export interface ElementoFormOptions {
  proveedores: OptionItem[];
  tiposElementos: OptionItem[];
  formatos: FormatoOption[];
  tamanos: OptionItem[];
  orientaciones: OptionItem[];
  provincias: OptionItem[];
  municipios: MunicipioOption[];
  sectores: SectorOption[];
}

export const EMPTY_ELEMENTO_FORM_OPTIONS: ElementoFormOptions = {
  proveedores: [],
  tiposElementos: [],
  formatos: [],
  tamanos: [],
  orientaciones: [],
  provincias: [],
  municipios: [],
  sectores: [],
};
