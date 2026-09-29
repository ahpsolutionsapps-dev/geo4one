export interface PeriodoColocacion {
  id: string;
  fechaInicial: string;
  fechaFinal: string;
  generalesSeguimiento: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface PeriodoColocacionFormValues {
  fechaInicial: string;
  fechaFinal: string;
  generalesSeguimiento: string;
  activo: boolean;
}
