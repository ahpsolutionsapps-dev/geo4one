import { PeriodoColocacion } from '../entities/periodo-colocacion';

export interface CreatePeriodoColocacionInput {
  fechaInicial: Date;
  fechaFinal: Date;
  generalesSeguimiento?: string | null;
  creadoPor: number;
}

export interface UpdatePeriodoColocacionInput {
  fechaInicial?: Date;
  fechaFinal?: Date;
  generalesSeguimiento?: string | null;
  activo?: boolean;
  actualizadoPor: number;
}

export interface PeriodoColocacionRepository {
  findMany(): Promise<PeriodoColocacion[]>;
  findById(idPeriodoColocacion: number): Promise<PeriodoColocacion | null>;
  create(input: CreatePeriodoColocacionInput): Promise<PeriodoColocacion>;
  update(idPeriodoColocacion: number, input: UpdatePeriodoColocacionInput): Promise<PeriodoColocacion>;
  deactivate(idPeriodoColocacion: number, actualizadoPor: number): Promise<void>;
}
