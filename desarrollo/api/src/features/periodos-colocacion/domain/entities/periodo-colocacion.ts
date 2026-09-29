export interface PeriodoColocacionProps {
  idPeriodoColocacion: number;
  fechaInicial: Date;
  fechaFinal: Date;
  generalesSeguimiento: string | null;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class PeriodoColocacion {
  constructor(private readonly props: PeriodoColocacionProps) {}

  toPrimitives(): PeriodoColocacionProps {
    return { ...this.props };
  }
}
