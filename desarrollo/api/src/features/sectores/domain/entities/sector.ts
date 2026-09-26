export interface SectorProps {
  idSectorBarrio: number;
  idMunicipio: number;
  municipioNombre: string;
  provinciaNombre: string;
  sectorBarrio: string;
  circunscripcion: string | null;
  latitud: number | null;
  longitud: number | null;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class Sector {
  constructor(private readonly props: SectorProps) {}

  toPrimitives(): SectorProps {
    return { ...this.props };
  }
}
