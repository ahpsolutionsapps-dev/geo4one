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

  toPrimitives(): MunicipioProps {
    return { ...this.props };
  }
}
