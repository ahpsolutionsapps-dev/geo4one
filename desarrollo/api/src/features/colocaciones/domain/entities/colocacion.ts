export interface ColocacionProps {
  idColocacion: number;
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
  fechaAnulacion: Date | null;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class Colocacion {
  constructor(private readonly props: ColocacionProps) {}

  toPrimitives(): ColocacionProps {
    return { ...this.props };
  }
}
