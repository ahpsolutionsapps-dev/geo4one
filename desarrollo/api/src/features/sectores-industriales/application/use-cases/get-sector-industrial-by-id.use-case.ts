import { NotFoundError } from '../../../../core/errors/app-error';
import { SectorIndustrialProps } from '../../domain/entities/sector-industrial';
import { SectorIndustrialRepository } from '../../domain/repositories/sector-industrial-repository';

export class GetSectorIndustrialByIdUseCase {
  constructor(private readonly sectoresIndustriales: SectorIndustrialRepository) {}

  async execute(idSectorIndustrial: number): Promise<SectorIndustrialProps> {
    const sectorIndustrial = await this.sectoresIndustriales.findById(idSectorIndustrial);
    if (!sectorIndustrial) {
      throw new NotFoundError('Sector industrial no encontrado');
    }

    return sectorIndustrial.toPrimitives();
  }
}