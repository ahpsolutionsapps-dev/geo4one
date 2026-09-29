import { CategoriaAnunciante } from '../entities/categoria-anunciante';

export interface CreateCategoriaAnuncianteInput {
  idSectorIndustrial: number;
  idSubSectorIndustrial: number;
  categoriaAnunciante: string;
  creadoPor: number;
}

export interface UpdateCategoriaAnuncianteInput {
  idSectorIndustrial?: number;
  idSubSectorIndustrial?: number;
  categoriaAnunciante?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export interface CategoriaAnuncianteRepository {
  findMany(): Promise<CategoriaAnunciante[]>;
  findById(idCategoriaAnunciante: number): Promise<CategoriaAnunciante | null>;
  findByNombreInSubSector(idSubSectorIndustrial: number, categoriaAnunciante: string): Promise<CategoriaAnunciante | null>;
  create(input: CreateCategoriaAnuncianteInput): Promise<CategoriaAnunciante>;
  update(idCategoriaAnunciante: number, input: UpdateCategoriaAnuncianteInput): Promise<CategoriaAnunciante>;
  deactivate(idCategoriaAnunciante: number, actualizadoPor: number): Promise<void>;
}