import { SubSectorIndustrial } from '../entities/sub-sector-industrial';

export interface CreateSubSectorIndustrialInput {
  idSectorIndustrial: number;
  subSectorIndustrial: string;
  creadoPor: number;
}

export interface UpdateSubSectorIndustrialInput {
  idSectorIndustrial?: number;
  subSectorIndustrial?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export interface SubSectorIndustrialRepository {
  findMany(): Promise<SubSectorIndustrial[]>;
  findById(idSubSectorIndustrial: number): Promise<SubSectorIndustrial | null>;
  findByNombreInSector(idSectorIndustrial: number, subSectorIndustrial: string): Promise<SubSectorIndustrial | null>;
  create(input: CreateSubSectorIndustrialInput): Promise<SubSectorIndustrial>;
  update(idSubSectorIndustrial: number, input: UpdateSubSectorIndustrialInput): Promise<SubSectorIndustrial>;
  deactivate(idSubSectorIndustrial: number, actualizadoPor: number): Promise<void>;
}