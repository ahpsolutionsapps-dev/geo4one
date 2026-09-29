import { ConflictError, NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { SectorIndustrialRepository } from '../../../sectores-industriales/domain/repositories/sector-industrial-repository';
import { SubSectorIndustrialRepository } from '../../../sub-sectores-industriales/domain/repositories/sub-sector-industrial-repository';
import { CategoriaAnuncianteProps } from '../../domain/entities/categoria-anunciante';
import { CategoriaAnuncianteRepository } from '../../domain/repositories/categoria-anunciante-repository';

export interface CreateCategoriaAnuncianteUseCaseInput {
  idSectorIndustrial: number;
  idSubSectorIndustrial: number;
  categoriaAnunciante: string;
  creadoPor: number;
}

export class CreateCategoriaAnuncianteUseCase {
  constructor(
    private readonly categoriasAnunciantes: CategoriaAnuncianteRepository,
    private readonly sectoresIndustriales: SectorIndustrialRepository,
    private readonly subSectoresIndustriales: SubSectorIndustrialRepository,
  ) {}

  async execute(input: CreateCategoriaAnuncianteUseCaseInput): Promise<CategoriaAnuncianteProps> {
    const categoriaAnunciante = input.categoriaAnunciante.trim();

    const sectorIndustrial = await this.sectoresIndustriales.findById(input.idSectorIndustrial);
    if (!sectorIndustrial) {
      throw new NotFoundError('Sector industrial no encontrado');
    }

    const subSectorIndustrial = await this.subSectoresIndustriales.findById(input.idSubSectorIndustrial);
    if (!subSectorIndustrial) {
      throw new NotFoundError('Sub sector industrial no encontrado');
    }

    const subSectorData = subSectorIndustrial.toPrimitives();
    if (subSectorData.idSectorIndustrial !== input.idSectorIndustrial) {
      throw new ValidationError('El sub sector industrial no pertenece al sector industrial seleccionado');
    }

    const existing = await this.categoriasAnunciantes.findByNombreInSubSector(
      input.idSubSectorIndustrial,
      categoriaAnunciante,
    );
    if (existing) {
      throw new ConflictError('Ya existe una categoría de anunciante con ese nombre en ese sub sector');
    }

    const created = await this.categoriasAnunciantes.create({
      idSectorIndustrial: input.idSectorIndustrial,
      idSubSectorIndustrial: input.idSubSectorIndustrial,
      categoriaAnunciante,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}