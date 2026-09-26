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

export interface CatalogoSimpleRecord {
  id: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  creadoPor: number | null;
  actualizadoPor: number | null;
}

export interface FormatoCatalogoRecord extends CatalogoSimpleRecord {
  idTipoElemento: number;
  tipoElemento: string;
}

export interface CatalogoSimpleInput {
  nombre: string;
  creadoPor: number;
}

export interface CatalogoSimpleUpdateInput {
  nombre?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export interface FormatoCatalogoInput {
  idTipoElemento: number;
  formato: string;
  creadoPor: number;
}

export interface FormatoCatalogoUpdateInput {
  idTipoElemento?: number;
  formato?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export interface ElementoRepository {
  findMany(filters?: FindElementosFilters): Promise<ElementoRecord[]>;
  findById(idElemento: number): Promise<ElementoRecord | null>;
  create(input: CreateElementoInput): Promise<ElementoRecord>;
  update(idElemento: number, input: UpdateElementoInput): Promise<ElementoRecord>;
  softDelete(idElemento: number, idUsuarioAnula: number): Promise<ElementoRecord>;

  findTiposElementosCatalogo(): Promise<CatalogoSimpleRecord[]>;
  createTipoElementoCatalogo(input: CatalogoSimpleInput): Promise<CatalogoSimpleRecord>;
  updateTipoElementoCatalogo(
    idTipoElemento: number,
    input: CatalogoSimpleUpdateInput,
  ): Promise<CatalogoSimpleRecord>;
  deactivateTipoElementoCatalogo(
    idTipoElemento: number,
    actualizadoPor: number,
  ): Promise<void>;

  findOrientacionesCatalogo(): Promise<CatalogoSimpleRecord[]>;
  createOrientacionCatalogo(input: CatalogoSimpleInput): Promise<CatalogoSimpleRecord>;
  updateOrientacionCatalogo(
    idOrientacion: number,
    input: CatalogoSimpleUpdateInput,
  ): Promise<CatalogoSimpleRecord>;
  deactivateOrientacionCatalogo(
    idOrientacion: number,
    actualizadoPor: number,
  ): Promise<void>;

  findDimensionesCatalogo(): Promise<CatalogoSimpleRecord[]>;
  createDimensionCatalogo(input: CatalogoSimpleInput): Promise<CatalogoSimpleRecord>;
  updateDimensionCatalogo(
    idTamano: number,
    input: CatalogoSimpleUpdateInput,
  ): Promise<CatalogoSimpleRecord>;
  deactivateDimensionCatalogo(idTamano: number, actualizadoPor: number): Promise<void>;

  findFormatosCatalogo(): Promise<FormatoCatalogoRecord[]>;
  createFormatoCatalogo(input: FormatoCatalogoInput): Promise<FormatoCatalogoRecord>;
  updateFormatoCatalogo(
    idFormato: number,
    input: FormatoCatalogoUpdateInput,
  ): Promise<FormatoCatalogoRecord>;
  deactivateFormatoCatalogo(idFormato: number, actualizadoPor: number): Promise<void>;
}
