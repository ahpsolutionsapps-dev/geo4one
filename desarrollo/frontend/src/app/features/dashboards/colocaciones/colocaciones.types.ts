export interface Colocacion {
  id: string;
  codigoSeguimiento: string;
  idElemento: number;
  elemento: string;
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
  idPeriodoColocacion: number;
  periodo: string;
  observaciones: string | null;
  activo: boolean;
  anulado: boolean;
  fechaAnulacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface ColocacionFormValues {
  codigoSeguimiento: string;
  idElemento: string;
  idVersionCampana: string;
  idPeriodoColocacion: string;
  observaciones: string;
  activo: boolean;
}
