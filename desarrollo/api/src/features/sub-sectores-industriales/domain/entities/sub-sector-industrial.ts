export interface SubSectorIndustrialProps {
  idSubSectorIndustrial: number;
  idSectorIndustrial: number;
  sectorIndustrial: string;
  subSectorIndustrial: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class SubSectorIndustrial {
  constructor(private readonly props: SubSectorIndustrialProps) {}

  toPrimitives(): SubSectorIndustrialProps {
    return { ...this.props };
  }
}