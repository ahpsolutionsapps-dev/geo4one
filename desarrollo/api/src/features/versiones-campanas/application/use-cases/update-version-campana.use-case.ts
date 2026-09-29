import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { VersionCampanaProps } from '../../domain/entities/version-campana';
import { VersionCampanaRepository } from '../../domain/repositories/version-campana-repository';

export interface UpdateVersionCampanaUseCaseInput {
  idAnunciante?: number;
  idMarcaProducto?: number | null;
  idComboAnunciante?: number | null;
  versionCampana?: string;
  leyendaSeguimiento?: string | null;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateVersionCampanaUseCase {
  constructor(private readonly versionesCampanas: VersionCampanaRepository) {}

  async execute(
    idVersionCampana: number,
    input: UpdateVersionCampanaUseCaseInput,
  ): Promise<VersionCampanaProps> {
    const existing = await this.versionesCampanas.findById(idVersionCampana);
    if (!existing) {
      throw new NotFoundError('Version de campana no encontrada');
    }

    const current = existing.toPrimitives();
    const nextIdAnunciante = input.idAnunciante ?? current.idAnunciante;
    const nextVersionCampana = input.versionCampana ?? current.versionCampana;
    const nextIdMarcaProducto =
      input.idMarcaProducto !== undefined ? input.idMarcaProducto : current.idMarcaProducto;
    const nextIdComboAnunciante =
      input.idComboAnunciante !== undefined ? input.idComboAnunciante : current.idComboAnunciante;

    const anunciante = await this.versionesCampanas.findAnuncianteById(nextIdAnunciante);
    if (!anunciante) {
      throw new NotFoundError('Anunciante no encontrado');
    }

    if (!anunciante.activo) {
      throw new ValidationError('El anunciante no esta activo');
    }

    if (!nextIdMarcaProducto && !nextIdComboAnunciante) {
      throw new ValidationError('Debes seleccionar una marca/producto o un combo');
    }

    if (nextIdMarcaProducto) {
      const marca = await this.versionesCampanas.findMarcaProductoById(nextIdMarcaProducto);
      if (!marca) {
        throw new NotFoundError('Marca/producto no encontrada');
      }

      if (!marca.activo) {
        throw new ValidationError('La marca/producto no esta activa');
      }

      if (marca.idAnunciante !== nextIdAnunciante) {
        throw new ValidationError('La marca/producto no pertenece al anunciante seleccionado');
      }
    }

    if (nextIdComboAnunciante) {
      const combo = await this.versionesCampanas.findComboAnuncianteById(nextIdComboAnunciante);
      if (!combo) {
        throw new NotFoundError('Combo de anunciante no encontrado');
      }

      if (!combo.activo) {
        throw new ValidationError('El combo de anunciante no esta activo');
      }
    }

    const duplicated = await this.versionesCampanas.findByNombreInAnunciante(
      nextIdAnunciante,
      nextVersionCampana,
    );

    if (duplicated && duplicated.toPrimitives().idVersionCampana !== idVersionCampana) {
      throw new ValidationError('Ya existe una version de campana con ese nombre para el anunciante');
    }

    const updated = await this.versionesCampanas.update(idVersionCampana, {
      idAnunciante: input.idAnunciante,
      idMarcaProducto: input.idMarcaProducto,
      idComboAnunciante: input.idComboAnunciante,
      versionCampana: input.versionCampana,
      leyendaSeguimiento: input.leyendaSeguimiento,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
