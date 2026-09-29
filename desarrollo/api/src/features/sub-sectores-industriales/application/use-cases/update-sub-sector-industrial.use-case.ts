import { ConflictError, NotFoundError } from '../../../../core/errors/app-error';
import { SectorIndustrialRepository } from '../../../sectores-industriales/domain/repositories/sector-industrial-repository';
import { SubSectorIndustrialProps } from '../../domain/entities/sub-sector-industrial';
import { SubSectorIndustrialRepository } from '../../domain/repositories/sub-sector-industrial-repository';

export interface UpdateSubSectorIndustrialUseCaseInput {
  idSectorIndustrial?: number;
  subSectorIndustrial?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateSubSectorIndustrialUseCase {
  constructor(
    private readonly subSectoresIndustriales: SubSectorIndustrialRepository,
    private readonly sectoresIndustriales: SectorIndustrialRepository,
  ) {}

  async execute(
    idSubSectorIndustrial: number,
    input: UpdateSubSectorIndustrialUseCaseInput,
  ): Promise<SubSectorIndustrialProps> {
    const existing = await this.subSectoresIndustriales.findById(idSubSectorIndustrial);
    if (!existing) {
      throw new NotFoundError('Sub sector industrial no encontrado');
    }

    const existingData = existing.toPrimitives();
    const nextSectorIndustrial = input.idSectorIndustrial ?? existingData.idSectorIndustrial;
    const nextSubSectorIndustrial = input.subSectorIndustrial?.trim() ?? existingData.subSectorIndustrial;

    if (input.idSectorIndustrial !== undefined) {
      const sectorIndustrial = await this.sectoresIndustriales.findById(input.idSectorIndustrial);
      if (!sectorIndustrial) {
        throw new NotFoundError('Sector industrial no encontrado');
      }
    }

    const byName = await this.subSectoresIndustriales.findByNombreInSector(
      nextSectorIndustrial,
      nextSubSectorIndustrial,
    );
    if (byName && byName.toPrimitives().idSubSectorIndustrial !== idSubSectorIndustrial) {
      throw new ConflictError('Ya existe un sub sector industrial con ese nombre en ese sector');
    }

    const updated = await this.subSectoresIndustriales.update(idSubSectorIndustrial, {
      idSectorIndustrial: input.idSectorIndustrial,
      subSectorIndustrial: input.subSectorIndustrial?.trim(),
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}