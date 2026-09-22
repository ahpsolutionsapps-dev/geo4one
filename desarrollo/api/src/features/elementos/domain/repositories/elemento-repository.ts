export interface FindElementosFilters {
  includeAnulados?: boolean;
  activo?: boolean;
  idProveedor?: number;
  idTipoElemento?: number;
  termino?: string;
}

export interface CreateElementoInput {
  idProveedor: number;
  licencia?: string | null;
  fechaEmision?: Date | string | null;
  fechaVencimiento?: Date | string | null;
  idSeguimiento?: string | null;
  idTipoElemento: number;
  idFormato?: number | null;
  idTamano?: number | null;
  activo?: boolean;
  costoAlquiler?: number | string | null;
  direccion?: string | null;
  idOrientacion?: number | null;
  idProvincia?: number | null;
  idMunicipio?: number | null;
  idSectorBarrio?: number | null;
  circunscripcion?: string | null;
  latitud?: number | string | null;
  longitud?: number | string | null;
  idUsuarioRegistra?: number;
}

export interface UpdateElementoInput {
  idProveedor?: number;
  licencia?: string | null;
  fechaEmision?: Date | string | null;
  fechaVencimiento?: Date | string | null;
  idSeguimiento?: string | null;
  idTipoElemento?: number;
  idFormato?: number | null;
  idTamano?: number | null;
  activo?: boolean;
  costoAlquiler?: number | string | null;
  direccion?: string | null;
  idOrientacion?: number | null;
  idProvincia?: number | null;
  idMunicipio?: number | null;
  idSectorBarrio?: number | null;
  circunscripcion?: string | null;
  latitud?: number | string | null;
  longitud?: number | string | null;
  comentarioAnulado?: string | null;
  idUsuarioModifica?: number;
}

export interface ElementoRecord {
  idElemento: number;
  idProveedor: number;
  licencia?: string | null;
  fechaEmision?: Date | null;
  fechaVencimiento?: Date | null;
  idSeguimiento?: string | null;
  idTipoElemento: number;
  idFormato?: number | null;
  idTamano?: number | null;
  activo: boolean;
  costoAlquiler?: number | string | null;
  direccion?: string | null;
  idOrientacion?: number | null;
  idProvincia?: number | null;
  idMunicipio?: number | null;
  idSectorBarrio?: number | null;
  circunscripcion?: string | null;
  latitud?: number | string | null;
  longitud?: number | string | null;
  anulado: boolean;
  anuladoPor?: number | null;
  comentarioAnulado?: string | null;
  fechaAnulacion?: Date | null;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor?: number | null;
  actualizadoPor?: number | null;
}

export interface ElementoRepository {
  findMany(filters?: FindElementosFilters): Promise<ElementoRecord[]>;
  findById(idElemento: number): Promise<ElementoRecord | null>;
  create(input: CreateElementoInput): Promise<ElementoRecord>;
  update(idElemento: number, input: UpdateElementoInput): Promise<ElementoRecord>;
  softDelete(idElemento: number, idUsuarioAnula: number): Promise<ElementoRecord>;
}
