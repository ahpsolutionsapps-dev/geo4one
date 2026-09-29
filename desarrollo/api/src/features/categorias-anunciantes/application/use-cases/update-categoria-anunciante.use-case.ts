import { ConflictError, NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { SectorIndustrialRepository } from '../../../sectores-industriales/domain/repositories/sector-industrial-repository';
import { SubSectorIndustrialRepository } from '../../../sub-sectores-industriales/domain/repositories/sub-sector-industrial-repository';
import { CategoriaAnuncianteProps } from '../../domain/entities/categoria-anunciante';
import { CategoriaAnuncianteRepository } from '../../domain/repositories/categoria-anunciante-repository';

export interface UpdateCategoriaAnuncianteUseCaseInput {
  idSectorIndustrial?: number;
  idSubSectorIndustrial?: number;
  categoriaAnunciante?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateCategoriaAnuncianteUseCase {
  constructor(
    private readonly categoriasAnunciantes: CategoriaAnuncianteRepository,
    private readonly sectoresIndustriales: SectorIndustrialRepository,
    private readonly subSectoresIndustriales: SubSectorIndustrialRepository,
  ) {}

  async execute(
    idCategoriaAnunciante: number,
    input: UpdateCategoriaAnuncianteUseCaseInput,
  ): Promise<CategoriaAnuncianteProps> {
    const existing = await this.categoriasAnunciantes.findById(idCategoriaAnunciante);
    if (!existing) {
      throw new NotFoundError('Categoría de anunciante no encontrada');
    }

    const existingData = existing.toPrimitives();
    const nextSectorIndustrial = input.idSectorIndustrial ?? existingData.idSectorIndustrial;
    const nextSubSectorIndustrial = input.idSubSectorIndustrial ?? existingData.idSubSectorIndustrial;
    const nextCategoriaAnunciante = input.categoriaAnunciante?.trim() ?? existingData.categoriaAnunciante;

    const sectorIndustrial = await this.sectoresIndustriales.findById(nextSectorIndustrial);
    if (!sectorIndustrial) {
      throw new NotFoundError('Sector industrial no encontrado');
    }

    const subSectorIndustrial = await this.subSectoresIndustriales.findById(nextSubSectorIndustrial);
    if (!subSectorIndustrial) {
      throw new NotFoundError('Sub sector industrial no encontrado');
    }

    if (subSectorIndustrial.toPrimitives().idSectorIndustrial !== nextSectorIndustrial) {
      throw new ValidationError('El sub sector industrial no pertenece al sector industrial seleccionado');
    }

    const existingByName = await this.categoriasAnunciantes.findByNombreInSubSector(
      nextSubSectorIndustrial,
      nextCategoriaAnunciante,
    );
    if (existingByName && existingByName.toPrimitives().idCategoriaAnunciante !== idCategoriaAnunciante) {
      throw new ConflictError('Ya existe una categoría de anunciante con ese nombre en ese sub sector');
    }

    const updated = await this.categoriasAnunciantes.update(idCategoriaAnunciante, {
      idSectorIndustrial: input.idSectorIndustrial,
      idSubSectorIndustrial: input.idSubSectorIndustrial,
      categoriaAnunciante: input.categoriaAnunciante?.trim(),
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}