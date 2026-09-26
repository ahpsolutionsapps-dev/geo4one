import { Sector } from '../entities/sector';

export interface CreateSectorInput {
  idMunicipio: number;
  sectorBarrio: string;
  circunscripcion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  creadoPor: number;
}

export interface UpdateSectorInput {
  idMunicipio?: number;
  sectorBarrio?: string;
  circunscripcion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  activo?: boolean;
  actualizadoPor: number;
}

export interface SectorRepository {
  findMany(): Promise<Sector[]>;
  findById(idSectorBarrio: number): Promise<Sector | null>;
  findByNombreInMunicipio(idMunicipio: number, sectorBarrio: string): Promise<Sector | null>;
  create(input: CreateSectorInput): Promise<Sector>;
  update(idSectorBarrio: number, input: UpdateSectorInput): Promise<Sector>;
  deactivate(idSectorBarrio: number, actualizadoPor: number): Promise<void>;
}
