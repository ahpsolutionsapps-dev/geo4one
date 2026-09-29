import { NotFoundError } from '../../../../core/errors/app-error';
import { SubSectorIndustrialProps } from '../../domain/entities/sub-sector-industrial';
import { SubSectorIndustrialRepository } from '../../domain/repositories/sub-sector-industrial-repository';

export class GetSubSectorIndustrialByIdUseCase {
  constructor(private readonly subSectoresIndustriales: SubSectorIndustrialRepository) {}

  async execute(idSubSectorIndustrial: number): Promise<SubSectorIndustrialProps> {
    const subSectorIndustrial = await this.subSectoresIndustriales.findById(idSubSectorIndustrial);
    if (!subSectorIndustrial) {
      throw new NotFoundError('Sub sector industrial no encontrado');
    }

    return subSectorIndustrial.toPrimitives();
  }
}