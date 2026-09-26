import { Provincia } from '../entities/provincia';

export interface CreateProvinciaInput {
  provincia: string;
  latitud?: number | null;
  longitud?: number | null;
  creadoPor: number;
}

export interface UpdateProvinciaInput {
  provincia?: string;
  latitud?: number | null;
  longitud?: number | null;
  activo?: boolean;
  actualizadoPor: number;
}

export interface ProvinciaRepository {
  findMany(): Promise<Provincia[]>;
  findById(idProvincia: number): Promise<Provincia | null>;
  findByNombre(provincia: string): Promise<Provincia | null>;
  create(input: CreateProvinciaInput): Promise<Provincia>;
  update(idProvincia: number, input: UpdateProvinciaInput): Promise<Provincia>;
  deactivate(idProvincia: number, actualizadoPor: number): Promise<void>;
}
