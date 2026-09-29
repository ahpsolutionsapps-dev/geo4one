import { ConflictError, NotFoundError } from '../../../../core/errors/app-error';
import { SectorIndustrialProps } from '../../domain/entities/sector-industrial';
import { SectorIndustrialRepository } from '../../domain/repositories/sector-industrial-repository';

export interface UpdateSectorIndustrialUseCaseInput {
  sectorIndustrial?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateSectorIndustrialUseCase {
  constructor(private readonly sectoresIndustriales: SectorIndustrialRepository) {}

  async execute(
    idSectorIndustrial: number,
    input: UpdateSectorIndustrialUseCaseInput,
  ): Promise<SectorIndustrialProps> {
    const existing = await this.sectoresIndustriales.findById(idSectorIndustrial);
    if (!existing) {
      throw new NotFoundError('Sector industrial no encontrado');
    }

    const existingData = existing.toPrimitives();
    const nextSectorIndustrial = input.sectorIndustrial?.trim() ?? existingData.sectorIndustrial;

    if (input.sectorIndustrial !== undefined) {
      const byName = await this.sectoresIndustriales.findByNombre(nextSectorIndustrial);
      if (byName && byName.toPrimitives().idSectorIndustrial !== idSectorIndustrial) {
        throw new ConflictError('Ya existe un sector industrial con ese nombre');
      }
    }

    const updated = await this.sectoresIndustriales.update(idSectorIndustrial, {
      sectorIndustrial: input.sectorIndustrial?.trim(),
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}