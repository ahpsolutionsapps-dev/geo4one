export interface MarcaProducto {
  id: string;
  idAnunciante: number;
  anunciante: string;
  idCategoriaAnunciante: number;
  categoriaAnunciante: string;
  marcaProducto: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface MarcaProductoFormValues {
  idAnunciante: string;
  idCategoriaAnunciante: string;
  marcaProducto: string;
  activo: boolean;
}