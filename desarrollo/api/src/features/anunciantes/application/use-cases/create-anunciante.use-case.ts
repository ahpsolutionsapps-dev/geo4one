import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { AnuncianteProps } from '../../domain/entities/anunciante';
import { AnuncianteRepository } from '../../domain/repositories/anunciante-repository';

export interface CreateAnuncianteUseCaseInput {
  idSectorIndustrial: number;
  idSubSectorIndustrial: number;
  idCategoriaAnunciante: number;
  anunciante: string;
  creadoPor: number;
}

export class CreateAnuncianteUseCase {
  constructor(private readonly anunciantes: AnuncianteRepository) {}

  async execute(input: CreateAnuncianteUseCaseInput): Promise<AnuncianteProps> {
    const sector = await this.anunciantes.findSectorById(input.idSectorIndustrial);
    if (!sector) {
      throw new NotFoundError('Sector industrial no encontrado');
    }

    if (!sector.activo) {
      throw new ValidationError('El sector industrial no esta activo');
    }

    const subSector = await this.anunciantes.findSubSectorById(input.idSubSectorIndustrial);
    if (!subSector) {
      throw new NotFoundError('Sub sector industrial no encontrado');
    }

    if (!subSector.activo) {
      throw new ValidationError('El sub sector industrial no esta activo');
    }

    if (subSector.idSectorIndustrial !== input.idSectorIndustrial) {
      throw new ValidationError('El sub sector no pertenece al sector industrial seleccionado');
    }

    const categoria = await this.anunciantes.findCategoriaById(input.idCategoriaAnunciante);
    if (!categoria) {
      throw new NotFoundError('Categoria de anunciante no encontrada');
    }

    if (!categoria.activo) {
      throw new ValidationError('La categoria de anunciante no esta activa');
    }

    if (categoria.idSectorIndustrial !== input.idSectorIndustrial) {
      throw new ValidationError('La categoria no pertenece al sector industrial seleccionado');
    }

    if (categoria.idSubSectorIndustrial !== input.idSubSectorIndustrial) {
      throw new ValidationError('La categoria no pertenece al sub sector seleccionado');
    }

    const existing = await this.anunciantes.findByNombreInCategoria(
      input.idCategoriaAnunciante,
      input.anunciante,
    );

    if (existing) {
      throw new ValidationError('Ya existe un anunciante con ese nombre en la categoria seleccionada');
    }

    const created = await this.anunciantes.create({
      idSectorIndustrial: input.idSectorIndustrial,
      idSubSectorIndustrial: input.idSubSectorIndustrial,
      idCategoriaAnunciante: input.idCategoriaAnunciante,
      anunciante: input.anunciante,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
