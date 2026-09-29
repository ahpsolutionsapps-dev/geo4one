import { ConflictError } from '../../../../core/errors/app-error';
import { SectorIndustrialProps } from '../../domain/entities/sector-industrial';
import { SectorIndustrialRepository } from '../../domain/repositories/sector-industrial-repository';

export interface CreateSectorIndustrialUseCaseInput {
  sectorIndustrial: string;
  creadoPor: number;
}

export class CreateSectorIndustrialUseCase {
  constructor(private readonly sectoresIndustriales: SectorIndustrialRepository) {}

  async execute(input: CreateSectorIndustrialUseCaseInput): Promise<SectorIndustrialProps> {
    const sectorIndustrial = input.sectorIndustrial.trim();
    const existing = await this.sectoresIndustriales.findByNombre(sectorIndustrial);

    if (existing) {
      throw new ConflictError('Ya existe un sector industrial con ese nombre');
    }

    const created = await this.sectoresIndustriales.create({
      sectorIndustrial,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}