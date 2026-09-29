import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { MarcaAguaSeguimientoProps } from '../../domain/entities/marca-agua-seguimiento';
import { MarcaAguaSeguimientoRepository } from '../../domain/repositories/marca-agua-seguimiento-repository';

export interface UpdateMarcaAguaSeguimientoUseCaseInput {
  idVersionCampana?: number;
  imagenMuestra?: string | null;
  videoMuestra?: string | null;
  activo?: boolean;
  actualizadoPor: number;
}

function normalizeOptionalMedia(value?: string | null): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length === 0 ? null : normalized;
}

export class UpdateMarcaAguaSeguimientoUseCase {
  constructor(private readonly marcasAguaSeguimiento: MarcaAguaSeguimientoRepository) {}

  async execute(
    idFirmaMarcaAguaSeguimiento: number,
    input: UpdateMarcaAguaSeguimientoUseCaseInput,
  ): Promise<MarcaAguaSeguimientoProps> {
    const existing = await this.marcasAguaSeguimiento.findById(idFirmaMarcaAguaSeguimiento);
    if (!existing) {
      throw new NotFoundError('Marca de agua no encontrada');
    }

    const existingData = existing.toPrimitives();
    const nextVersion = input.idVersionCampana ?? existingData.idVersionCampana;
    const nextImagen = normalizeOptionalMedia(input.imagenMuestra);
    const nextVideo = normalizeOptionalMedia(input.videoMuestra);

    const version = await this.marcasAguaSeguimiento.findVersionCampanaById(nextVersion);
    if (!version) {
      throw new NotFoundError('Version de campana no encontrada');
    }

    if (!version.activo || version.anulado) {
      throw new ValidationError('La version de campana no esta disponible para seguimiento');
    }

    const finalImagen = nextImagen === undefined ? existingData.imagenMuestra : nextImagen;
    const finalVideo = nextVideo === undefined ? existingData.videoMuestra : nextVideo;

    if (!finalImagen && !finalVideo) {
      throw new ValidationError('Debes enviar al menos una ruta de imagen o video');
    }

    const updated = await this.marcasAguaSeguimiento.update(idFirmaMarcaAguaSeguimiento, {
      idVersionCampana: input.idVersionCampana,
      imagenMuestra: nextImagen,
      videoMuestra: nextVideo,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
