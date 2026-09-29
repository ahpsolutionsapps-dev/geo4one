export interface MarcaProductoProps {
  idMarcaProducto: number;
  idAnunciante: number;
  anunciante: string;
  idCategoriaAnunciante: number;
  categoriaAnunciante: string;
  marcaProducto: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export class MarcaProducto {
  constructor(private readonly props: MarcaProductoProps) {}

  toPrimitives(): MarcaProductoProps {
    return { ...this.props };
  }
}