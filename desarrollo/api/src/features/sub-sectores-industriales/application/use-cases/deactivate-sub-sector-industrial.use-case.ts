import { NotFoundError } from '../../../../core/errors/app-error';
import { SubSectorIndustrialRepository } from '../../domain/repositories/sub-sector-industrial-repository';

export class DeactivateSubSectorIndustrialUseCase {
  constructor(private readonly subSectoresIndustriales: SubSectorIndustrialRepository) {}

  async execute(idSubSectorIndustrial: number, actualizadoPor: number): Promise<void> {
    const existing = await this.subSectoresIndustriales.findById(idSubSectorIndustrial);
    if (!existing) {
      throw new NotFoundError('Sub sector industrial no encontrado');
    }

    await this.subSectoresIndustriales.deactivate(idSubSectorIndustrial, actualizadoPor);
  }
}