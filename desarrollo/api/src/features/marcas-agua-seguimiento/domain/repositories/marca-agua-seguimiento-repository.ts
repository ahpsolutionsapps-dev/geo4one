import { MarcaAguaSeguimiento } from '../entities/marca-agua-seguimiento';

export interface VersionCampanaOption {
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
}

export interface VersionCampanaLookup {
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
  activo: boolean;
  anulado: boolean;
}

export interface CreateMarcaAguaSeguimientoInput {
  idVersionCampana: number;
  imagenMuestra?: string | null;
  videoMuestra?: string | null;
  creadoPor: number;
}

export interface UpdateMarcaAguaSeguimientoInput {
  idVersionCampana?: number;
  imagenMuestra?: string | null;
  videoMuestra?: string | null;
  activo?: boolean;
  actualizadoPor: number;
}

export interface MarcaAguaSeguimientoRepository {
  findMany(): Promise<MarcaAguaSeguimiento[]>;
  findById(idFirmaMarcaAguaSeguimiento: number): Promise<MarcaAguaSeguimiento | null>;
  findVersionCampanaById(idVersionCampana: number): Promise<VersionCampanaLookup | null>;
  findVersionCampanaOptions(): Promise<VersionCampanaOption[]>;
  create(input: CreateMarcaAguaSeguimientoInput): Promise<MarcaAguaSeguimiento>;
  update(
    idFirmaMarcaAguaSeguimiento: number,
    input: UpdateMarcaAguaSeguimientoInput,
  ): Promise<MarcaAguaSeguimiento>;
  deactivate(idFirmaMarcaAguaSeguimiento: number, actualizadoPor: number): Promise<void>;
}
