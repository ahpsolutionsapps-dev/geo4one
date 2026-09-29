export interface VersionCampanaProps {
  idVersionCampana: number;
  idAnunciante: number;
  anunciante: string;
  idMarcaProducto: number | null;
  marcaProducto: string | null;
  idComboAnunciante: number | null;
  comboAnunciante: string | null;
  versionCampana: string;
  leyendaSeguimiento: string | null;
  activo: boolean;
  anulado: boolean;
  fechaAnulacion: Date | null;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class VersionCampana {
  constructor(private readonly props: VersionCampanaProps) {}

  toPrimitives(): VersionCampanaProps {
    return { ...this.props };
  }
}
