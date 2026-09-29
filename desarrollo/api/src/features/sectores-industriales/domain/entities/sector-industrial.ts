export interface SectorIndustrialProps {
  idSectorIndustrial: number;
  sectorIndustrial: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class SectorIndustrial {
  constructor(private readonly props: SectorIndustrialProps) {}

  toPrimitives(): SectorIndustrialProps {
    return { ...this.props };
  }
}