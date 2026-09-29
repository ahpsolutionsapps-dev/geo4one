export interface MarcaAguaSeguimiento {
  id: string;
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
  imagenMuestra: string | null;
  videoMuestra: string | null;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface MarcaAguaSeguimientoFormValues {
  idVersionCampana: string;
  imagenMuestra: string;
  videoMuestra: string;
  activo: boolean;
}
