import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { VersionCampanaProps } from '../../domain/entities/version-campana';
import { VersionCampanaRepository } from '../../domain/repositories/version-campana-repository';

export interface CreateVersionCampanaUseCaseInput {
  idAnunciante: number;
  idMarcaProducto?: number | null;
  idComboAnunciante?: number | null;
  versionCampana: string;
  leyendaSeguimiento?: string | null;
  creadoPor: number;
}

export class CreateVersionCampanaUseCase {
  constructor(private readonly versionesCampanas: VersionCampanaRepository) {}

  async execute(input: CreateVersionCampanaUseCaseInput): Promise<VersionCampanaProps> {
    const anunciante = await this.versionesCampanas.findAnuncianteById(input.idAnunciante);
    if (!anunciante) {
      throw new NotFoundError('Anunciante no encontrado');
    }

    if (!anunciante.activo) {
      throw new ValidationError('El anunciante no esta activo');
    }

    if (!input.idMarcaProducto && !input.idComboAnunciante) {
      throw new ValidationError('Debes seleccionar una marca/producto o un combo');
    }

    if (input.idMarcaProducto) {
      const marca = await this.versionesCampanas.findMarcaProductoById(input.idMarcaProducto);
      if (!marca) {
        throw new NotFoundError('Marca/producto no encontrada');
      }

      if (!marca.activo) {
        throw new ValidationError('La marca/producto no esta activa');
      }

      if (marca.idAnunciante !== input.idAnunciante) {
        throw new ValidationError('La marca/producto no pertenece al anunciante seleccionado');
      }
    }

    if (input.idComboAnunciante) {
      const combo = await this.versionesCampanas.findComboAnuncianteById(input.idComboAnunciante);
      if (!combo) {
        throw new NotFoundError('Combo de anunciante no encontrado');
      }

      if (!combo.activo) {
        throw new ValidationError('El combo de anunciante no esta activo');
      }
    }

    const existing = await this.versionesCampanas.findByNombreInAnunciante(
      input.idAnunciante,
      input.versionCampana,
    );

    if (existing) {
      throw new ValidationError('Ya existe una version de campana con ese nombre para el anunciante');
    }

    const created = await this.versionesCampanas.create({
      idAnunciante: input.idAnunciante,
      idMarcaProducto: input.idMarcaProducto,
      idComboAnunciante: input.idComboAnunciante,
      versionCampana: input.versionCampana,
      leyendaSeguimiento: input.leyendaSeguimiento,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
