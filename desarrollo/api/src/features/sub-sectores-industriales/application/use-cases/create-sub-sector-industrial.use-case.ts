import { ConflictError, NotFoundError } from '../../../../core/errors/app-error';
import { SectorIndustrialRepository } from '../../../sectores-industriales/domain/repositories/sector-industrial-repository';
import { SubSectorIndustrialProps } from '../../domain/entities/sub-sector-industrial';
import { SubSectorIndustrialRepository } from '../../domain/repositories/sub-sector-industrial-repository';

export interface CreateSubSectorIndustrialUseCaseInput {
  idSectorIndustrial: number;
  subSectorIndustrial: string;
  creadoPor: number;
}

export class CreateSubSectorIndustrialUseCase {
  constructor(
    private readonly subSectoresIndustriales: SubSectorIndustrialRepository,
    private readonly sectoresIndustriales: SectorIndustrialRepository,
  ) {}

  async execute(input: CreateSubSectorIndustrialUseCaseInput): Promise<SubSectorIndustrialProps> {
    const subSectorIndustrial = input.subSectorIndustrial.trim();
    const sectorIndustrial = await this.sectoresIndustriales.findById(input.idSectorIndustrial);

    if (!sectorIndustrial) {
      throw new NotFoundError('Sector industrial no encontrado');
    }

    const existing = await this.subSectoresIndustriales.findByNombreInSector(
      input.idSectorIndustrial,
      subSectorIndustrial,
    );
    if (existing) {
      throw new ConflictError('Ya existe un sub sector industrial con ese nombre en ese sector');
    }

    const created = await this.subSectoresIndustriales.create({
      idSectorIndustrial: input.idSectorIndustrial,
      subSectorIndustrial,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}