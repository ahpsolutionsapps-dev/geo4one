import { Colocacion } from '../entities/colocacion';

export interface ElementoOption {
  idElemento: number;
  elemento: string;
}

export interface VersionCampanaOption {
  idVersionCampana: number;
  versionCampana: string;
  anunciante: string;
}

export interface PeriodoColocacionOption {
  idPeriodoColocacion: number;
  fechaInicial: Date;
  fechaFinal: Date;
}

export interface CreateColocacionInput {
  codigoSeguimiento: string;
  idElemento: number;
  idVersionCampana: number;
  idPeriodoColocacion: number;
  observaciones?: string | null;
  creadoPor: number;
}

export interface UpdateColocacionInput {
  codigoSeguimiento?: string;
  idElemento?: number;
  idVersionCampana?: number;
  idPeriodoColocacion?: number;
  observaciones?: string | null;
  activo?: boolean;
  actualizadoPor: number;
}

export interface ColocacionRepository {
  findMany(): Promise<Colocacion[]>;
  findById(idColocacion: number): Promise<Colocacion | null>;
  findByCodigoSeguimiento(codigoSeguimiento: string): Promise<Colocacion | null>;

  findElementoById(
    idElemento: number,
  ): Promise<{ idElemento: number; activo: boolean; anulado: boolean; elemento: string } | null>;
  findVersionCampanaById(
    idVersionCampana: number,
  ): Promise<{ idVersionCampana: number; activo: boolean; anulado: boolean; versionCampana: string } | null>;
  findPeriodoById(
    idPeriodoColocacion: number,
  ): Promise<{ idPeriodoColocacion: number; activo: boolean; fechaInicial: Date; fechaFinal: Date } | null>;

  findElementosOptions(): Promise<ElementoOption[]>;
  findVersionesCampanaOptions(): Promise<VersionCampanaOption[]>;
  findPeriodosOptions(): Promise<PeriodoColocacionOption[]>;

  create(input: CreateColocacionInput): Promise<Colocacion>;
  update(idColocacion: number, input: UpdateColocacionInput): Promise<Colocacion>;
  deactivate(idColocacion: number, actualizadoPor: number): Promise<void>;
}
