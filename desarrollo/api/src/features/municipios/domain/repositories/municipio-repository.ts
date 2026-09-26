import { Municipio } from '../entities/municipio';

export interface CreateMunicipioInput {
  idProvincia: number;
  municipio: string;
  latitud?: number | null;
  longitud?: number | null;
  creadoPor: number;
}

export interface UpdateMunicipioInput {
  idProvincia?: number;
  municipio?: string;
  latitud?: number | null;
  longitud?: number | null;
  activo?: boolean;
  actualizadoPor: number;
}

export interface MunicipioRepository {
  findMany(): Promise<Municipio[]>;
  findById(idMunicipio: number): Promise<Municipio | null>;
  findByNombreInProvincia(idProvincia: number, municipio: string): Promise<Municipio | null>;
  create(input: CreateMunicipioInput): Promise<Municipio>;
  update(idMunicipio: number, input: UpdateMunicipioInput): Promise<Municipio>;
  deactivate(idMunicipio: number, actualizadoPor: number): Promise<void>;
}
