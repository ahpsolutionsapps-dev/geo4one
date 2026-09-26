export interface CatalogoSimpleItem {
  id: string;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CatalogoSimpleFormValues {
  nombre: string;
  activo: boolean;
}

export interface TipoElementoOption {
  id: string;
  nombre: string;
}

export interface FormatoCatalogoItem {
  id: string;
  idTipoElemento: string;
  tipoElemento: string;
  formato: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface FormatoCatalogoFormValues {
  idTipoElemento: string;
  formato: string;
  activo: boolean;
}
