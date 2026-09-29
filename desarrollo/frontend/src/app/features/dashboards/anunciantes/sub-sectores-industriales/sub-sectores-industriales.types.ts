export interface SubSectorIndustrial {
  id: string;
  idSectorIndustrial: number;
  sectorIndustrial: string;
  subSectorIndustrial: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface SubSectorIndustrialFormValues {
  idSectorIndustrial: string;
  subSectorIndustrial: string;
  activo: boolean;
}