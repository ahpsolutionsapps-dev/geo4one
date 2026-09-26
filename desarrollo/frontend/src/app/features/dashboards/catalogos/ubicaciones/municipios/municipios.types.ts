export interface Municipio {
  id: string;
  idProvincia: number;
  provinciaNombre: string;
  municipio: string;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface MunicipioFormValues {
  idProvincia: string;
  municipio: string;
  latitud: string;
  longitud: string;
  activo: boolean;
}
