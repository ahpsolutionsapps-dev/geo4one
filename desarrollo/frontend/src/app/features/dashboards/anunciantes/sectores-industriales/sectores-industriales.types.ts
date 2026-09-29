export interface SectorIndustrial {
  id: string;
  sectorIndustrial: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface SectorIndustrialFormValues {
  sectorIndustrial: string;
  activo: boolean;
}