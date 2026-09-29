export interface Campana {
  id: string;
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
  fechaAnulacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface CampanaFormValues {
  idAnunciante: string;
  idMarcaProducto: string;
  idComboAnunciante: string;
  versionCampana: string;
  leyendaSeguimiento: string;
  activo: boolean;
}
