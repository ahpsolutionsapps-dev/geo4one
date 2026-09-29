import { SectorIndustrial } from '../entities/sector-industrial';

export interface CreateSectorIndustrialInput {
  sectorIndustrial: string;
  creadoPor: number;
}

export interface UpdateSectorIndustrialInput {
  sectorIndustrial?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export interface SectorIndustrialRepository {
  findMany(): Promise<SectorIndustrial[]>;
  findById(idSectorIndustrial: number): Promise<SectorIndustrial | null>;
  findByNombre(sectorIndustrial: string): Promise<SectorIndustrial | null>;
  create(input: CreateSectorIndustrialInput): Promise<SectorIndustrial>;
  update(idSectorIndustrial: number, input: UpdateSectorIndustrialInput): Promise<SectorIndustrial>;
  deactivate(idSectorIndustrial: number, actualizadoPor: number): Promise<void>;
}