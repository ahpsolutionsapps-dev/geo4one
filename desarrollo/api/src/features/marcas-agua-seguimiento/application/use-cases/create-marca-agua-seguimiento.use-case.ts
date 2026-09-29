import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { MarcaAguaSeguimientoProps } from '../../domain/entities/marca-agua-seguimiento';
import { MarcaAguaSeguimientoRepository } from '../../domain/repositories/marca-agua-seguimiento-repository';

export interface CreateMarcaAguaSeguimientoUseCaseInput {
  idVersionCampana: number;
  imagenMuestra?: string | null;
  videoMuestra?: string | null;
  creadoPor: number;
}

function normalizeOptionalMedia(value?: string | null): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length === 0 ? null : normalized;
}

export class CreateMarcaAguaSeguimientoUseCase {
  constructor(private readonly marcasAguaSeguimiento: MarcaAguaSeguimientoRepository) {}

  async execute(input: CreateMarcaAguaSeguimientoUseCaseInput): Promise<MarcaAguaSeguimientoProps> {
    const version = await this.marcasAguaSeguimiento.findVersionCampanaById(input.idVersionCampana);
    if (!version) {
      throw new NotFoundError('Version de campana no encontrada');
    }

    if (!version.activo || version.anulado) {
      throw new ValidationError('La version de campana no esta disponible para seguimiento');
    }

    const imagenMuestra = normalizeOptionalMedia(input.imagenMuestra);
    const videoMuestra = normalizeOptionalMedia(input.videoMuestra);

    if (!imagenMuestra && !videoMuestra) {
      throw new ValidationError('Debes enviar al menos una ruta de imagen o video');
    }

    const created = await this.marcasAguaSeguimiento.create({
      idVersionCampana: input.idVersionCampana,
      imagenMuestra,
      videoMuestra,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
