export interface MunicipioProps {
  idMunicipio: number;
  idProvincia: number;
  provinciaNombre: string;
  municipio: string;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class Municipio {
  constructor(private readonly props: MunicipioProps) {}

  get idMunicipio(): number {
    return this.props.idMunicipio;
  }

  get idProvincia(): number {
    return this.props.idProvincia;
  }

  get provinciaNombre(): string {
    return this.props.provinciaNombre;
  }

  get municipio(): string {
    return this.props.municipio;
  }

  get latitud(): number | null {
    return this.props.latitud;
  }

  get longitud(): number | null {
    return this.props.longitud;
  }

  get activo(): boolean {
    return this.props.activo;
  }

  get fechaCreacion(): Date {
    return this.props.fechaCreacion;
  }

  get fechaActualizacion(): Date {
    return this.props.fechaActualizacion;
  }

  get creadoPor(): number | null {
    return this.props.creadoPor;
  }

  get actualizadoPor(): number | null {
    return this.props.actualizadoPor;
  }

  toPrimitives(): MunicipioProps {
    return { ...this.props };
  }
}
