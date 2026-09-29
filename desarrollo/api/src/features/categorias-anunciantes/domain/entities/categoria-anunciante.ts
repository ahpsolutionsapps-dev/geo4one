export interface CategoriaAnuncianteProps {
  idCategoriaAnunciante: number;
  idSectorIndustrial: number;
  sectorIndustrial: string;
  idSubSectorIndustrial: number;
  subSectorIndustrial: string;
  categoriaAnunciante: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class CategoriaAnunciante {
  constructor(private readonly props: CategoriaAnuncianteProps) {}

  toPrimitives(): CategoriaAnuncianteProps {
    return { ...this.props };
  }
}