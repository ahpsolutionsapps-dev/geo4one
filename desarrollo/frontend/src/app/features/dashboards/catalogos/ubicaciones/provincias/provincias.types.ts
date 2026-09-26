export interface Provincia {
  id: string;
  provincia: string;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ProvinciaFormValues {
  provincia: string;
  latitud: string;
  longitud: string;
  activo: boolean;
}
