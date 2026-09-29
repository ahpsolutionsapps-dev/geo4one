export interface MarcaAguaSeguimientoProps {
  idFirmaMarcaAguaSeguimiento: number;
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
  imagenMuestra: string | null;
  videoMuestra: string | null;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class MarcaAguaSeguimiento {
  constructor(private readonly props: MarcaAguaSeguimientoProps) {}

  toPrimitives(): MarcaAguaSeguimientoProps {
    return { ...this.props };
  }
}
