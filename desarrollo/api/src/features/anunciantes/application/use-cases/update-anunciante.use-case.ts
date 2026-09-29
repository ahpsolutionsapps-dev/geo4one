import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { AnuncianteProps } from '../../domain/entities/anunciante';
import { AnuncianteRepository } from '../../domain/repositories/anunciante-repository';

export interface UpdateAnuncianteUseCaseInput {
  idSectorIndustrial?: number;
  idSubSectorIndustrial?: number;
  idCategoriaAnunciante?: number;
  anunciante?: string;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateAnuncianteUseCase {
  constructor(private readonly anunciantes: AnuncianteRepository) {}

  async execute(idAnunciante: number, input: UpdateAnuncianteUseCaseInput): Promise<AnuncianteProps> {
    const existing = await this.anunciantes.findById(idAnunciante);
    if (!existing) {
      throw new NotFoundError('Anunciante no encontrado');
    }

    const current = existing.toPrimitives();
    const nextIdSector = input.idSectorIndustrial ?? current.idSectorIndustrial;
    const nextIdSubSector = input.idSubSectorIndustrial ?? current.idSubSectorIndustrial;
    const nextIdCategoria = input.idCategoriaAnunciante ?? current.idCategoriaAnunciante;
    const nextAnunciante = input.anunciante ?? current.anunciante;

    const sector = await this.anunciantes.findSectorById(nextIdSector);
    if (!sector) {
      throw new NotFoundError('Sector industrial no encontrado');
    }

    if (!sector.activo) {
      throw new ValidationError('El sector industrial no esta activo');
    }

    const subSector = await this.anunciantes.findSubSectorById(nextIdSubSector);
    if (!subSector) {
      throw new NotFoundError('Sub sector industrial no encontrado');
    }

    if (!subSector.activo) {
      throw new ValidationError('El sub sector industrial no esta activo');
    }

    if (subSector.idSectorIndustrial !== nextIdSector) {
      throw new ValidationError('El sub sector no pertenece al sector industrial seleccionado');
    }

    const categoria = await this.anunciantes.findCategoriaById(nextIdCategoria);
    if (!categoria) {
      throw new NotFoundError('Categoria de anunciante no encontrada');
    }

    if (!categoria.activo) {
      throw new ValidationError('La categoria de anunciante no esta activa');
    }

    if (categoria.idSectorIndustrial !== nextIdSector) {
      throw new ValidationError('La categoria no pertenece al sector industrial seleccionado');
    }

    if (categoria.idSubSectorIndustrial !== nextIdSubSector) {
      throw new ValidationError('La categoria no pertenece al sub sector seleccionado');
    }

    const duplicated = await this.anunciantes.findByNombreInCategoria(nextIdCategoria, nextAnunciante);

    if (duplicated && duplicated.toPrimitives().idAnunciante !== idAnunciante) {
      throw new ValidationError('Ya existe un anunciante con ese nombre en la categoria seleccionada');
    }

    const updated = await this.anunciantes.update(idAnunciante, {
      idSectorIndustrial: input.idSectorIndustrial,
      idSubSectorIndustrial: input.idSubSectorIndustrial,
      idCategoriaAnunciante: input.idCategoriaAnunciante,
      anunciante: input.anunciante,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
