import { VersionCampana } from '../entities/version-campana';

export interface AnuncianteOption {
  idAnunciante: number;
  anunciante: string;
}

export interface MarcaProductoOption {
  idMarcaProducto: number;
  idAnunciante: number;
  marcaProducto: string;
  anunciante: string;
}

export interface ComboAnuncianteOption {
  idComboAnunciante: number;
  comboAnunciante: string;
}

export interface CreateVersionCampanaInput {
  idAnunciante: number;
  idMarcaProducto?: number | null;
  idComboAnunciante?: number | null;
  versionCampana: string;
  leyendaSeguimiento?: string | null;
  creadoPor: number;
}

export interface UpdateVersionCampanaInput {
  idAnunciante?: number;
  idMarcaProducto?: number | null;
  idComboAnunciante?: number | null;
  versionCampana?: string;
  leyendaSeguimiento?: string | null;
  activo?: boolean;
  actualizadoPor: number;
}

export interface VersionCampanaRepository {
  findMany(): Promise<VersionCampana[]>;
  findById(idVersionCampana: number): Promise<VersionCampana | null>;
  findByNombreInAnunciante(idAnunciante: number, versionCampana: string): Promise<VersionCampana | null>;

  findAnuncianteById(idAnunciante: number): Promise<{ idAnunciante: number; anunciante: string; activo: boolean } | null>;
  findMarcaProductoById(
    idMarcaProducto: number,
  ): Promise<{ idMarcaProducto: number; idAnunciante: number; marcaProducto: string; activo: boolean } | null>;
  findComboAnuncianteById(
    idComboAnunciante: number,
  ): Promise<{ idComboAnunciante: number; comboAnunciante: string; activo: boolean } | null>;

  findAnunciantesOptions(): Promise<AnuncianteOption[]>;
  findMarcasProductosOptions(idAnunciante?: number): Promise<MarcaProductoOption[]>;
  findCombosAnunciantesOptions(): Promise<ComboAnuncianteOption[]>;

  create(input: CreateVersionCampanaInput): Promise<VersionCampana>;
  update(idVersionCampana: number, input: UpdateVersionCampanaInput): Promise<VersionCampana>;
  deactivate(idVersionCampana: number, actualizadoPor: number): Promise<void>;
}
