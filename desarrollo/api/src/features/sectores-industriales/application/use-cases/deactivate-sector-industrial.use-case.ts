import { NotFoundError } from '../../../../core/errors/app-error';
import { SectorIndustrialRepository } from '../../domain/repositories/sector-industrial-repository';

export class DeactivateSectorIndustrialUseCase {
  constructor(private readonly sectoresIndustriales: SectorIndustrialRepository) {}

  async execute(idSectorIndustrial: number, actualizadoPor: number): Promise<void> {
    const existing = await this.sectoresIndustriales.findById(idSectorIndustrial);
    if (!existing) {
      throw new NotFoundError('Sector industrial no encontrado');
    }

    await this.sectoresIndustriales.deactivate(idSectorIndustrial, actualizadoPor);
  }
}