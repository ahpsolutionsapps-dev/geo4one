import { Anunciante } from '../entities/anunciante';

export interface SectorIndustrialOption {
  idSectorIndustrial: number;
  sectorIndustrial: string;
}

export interface SubSectorIndustrialOption {
  idSubSectorIndustrial: number;
  idSectorIndustrial: number;
  subSectorIndustrial: string;
}

export interface CategoriaAnuncianteOption {
  idCategoriaAnunciante: number;
  idSectorIndustrial: number;
  idSubSectorIndustrial: number;
  categoriaAnunciante: string;
}

export interface CreateAnuncianteInput {
  idSectorIndustrial: number;
  idSubSectorIndustrial: number;
  idCategoriaAnunciante: number;
  anunciante: string;
  creadoPor: number;
}

export interface UpdateAnuncianteInput {
  idSectorIndustrial?: number;
  idSubSectorIndustrial?: number;
  idCategoriaAnunciante?: number;
  anunciante?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export interface AnuncianteRepository {
  findMany(): Promise<Anunciante[]>;
  findById(idAnunciante: number): Promise<Anunciante | null>;
  findByNombreInCategoria(idCategoriaAnunciante: number, anunciante: string): Promise<Anunciante | null>;

  findSectorById(
    idSectorIndustrial: number,
  ): Promise<{ idSectorIndustrial: number; sectorIndustrial: string; activo: boolean } | null>;
  findSubSectorById(
    idSubSectorIndustrial: number,
  ): Promise<{
    idSubSectorIndustrial: number;
    idSectorIndustrial: number;
    subSectorIndustrial: string;
    activo: boolean;
  } | null>;
  findCategoriaById(
    idCategoriaAnunciante: number,
  ): Promise<{
    idCategoriaAnunciante: number;
    idSectorIndustrial: number;
    idSubSectorIndustrial: number;
    categoriaAnunciante: string;
    activo: boolean;
  } | null>;

  findSectoresOptions(): Promise<SectorIndustrialOption[]>;
  findSubSectoresOptions(idSectorIndustrial?: number): Promise<SubSectorIndustrialOption[]>;
  findCategoriasOptions(idSubSectorIndustrial?: number): Promise<CategoriaAnuncianteOption[]>;

  create(input: CreateAnuncianteInput): Promise<Anunciante>;
  update(idAnunciante: number, input: UpdateAnuncianteInput): Promise<Anunciante>;
  deactivate(idAnunciante: number, actualizadoPor: number): Promise<void>;
}
