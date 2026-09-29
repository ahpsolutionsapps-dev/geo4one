export interface CategoriaAnunciante {
  id: string;
  idSectorIndustrial: number;
  sectorIndustrial: string;
  idSubSectorIndustrial: number;
  subSectorIndustrial: string;
  categoriaAnunciante: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface CategoriaAnuncianteFormValues {
  idSectorIndustrial: string;
  idSubSectorIndustrial: string;
  categoriaAnunciante: string;
  activo: boolean;
}