export interface ProvinciaProps {
  idProvincia: number;
  provincia: string;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class Provincia {
  constructor(private readonly props: ProvinciaProps) {}

  toPrimitives(): ProvinciaProps {
    return { ...this.props };
  }
}
