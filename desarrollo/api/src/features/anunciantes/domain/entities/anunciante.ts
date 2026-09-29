export interface AnuncianteProps {
  idAnunciante: number;
  idSectorIndustrial: number;
  sectorIndustrial: string;
  idSubSectorIndustrial: number;
  subSectorIndustrial: string;
  idCategoriaAnunciante: number;
  categoriaAnunciante: string;
  anunciante: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class Anunciante {
  constructor(private readonly props: AnuncianteProps) {}

  toPrimitives(): AnuncianteProps {
    return { ...this.props };
  }
}
