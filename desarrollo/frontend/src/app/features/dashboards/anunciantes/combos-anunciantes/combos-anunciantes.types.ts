export interface ComboMarca {
  idMarcaProducto: number;
  marcaProducto: string;
  anunciante: string;
  orden: number;
}

export interface ComboAnunciante {
  id: string;
  comboAnunciante: string;
  marcas: ComboMarca[];
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface ComboAnuncianteMarcaFormValues {
  idMarcaProducto: string;
  orden: number;
}

export interface ComboAnuncianteFormValues {
  comboAnunciante: string;
  marcas: ComboAnuncianteMarcaFormValues[];
  activo: boolean;
}
