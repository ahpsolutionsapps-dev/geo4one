export interface Anunciante {
  id: string;
  idSectorIndustrial: number;
  sectorIndustrial: string;
  idSubSectorIndustrial: number;
  subSectorIndustrial: string;
  idCategoriaAnunciante: number;
  categoriaAnunciante: string;
  anunciante: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface AnuncianteFormValues {
  idSectorIndustrial: string;
  idSubSectorIndustrial: string;
  idCategoriaAnunciante: string;
  anunciante: string;
  activo: boolean;
}
