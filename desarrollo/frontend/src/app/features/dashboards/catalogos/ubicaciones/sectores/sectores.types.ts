export interface Sector {
  id: string;
  idMunicipio: number;
  municipioNombre: string;
  provinciaNombre: string;
  sectorBarrio: string;
  circunscripcion: string | null;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface SectorFormValues {
  idMunicipio: string;
  sectorBarrio: string;
  circunscripcion: string;
  latitud: string;
  longitud: string;
  activo: boolean;
}
