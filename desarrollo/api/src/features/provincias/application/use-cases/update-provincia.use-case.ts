import { NotFoundError } from '../../../../core/errors/app-error';
import { ProvinciaProps } from '../../domain/entities/provincia';
import { ProvinciaRepository } from '../../domain/repositories/provincia-repository';

export interface UpdateProvinciaUseCaseInput {
  provincia?: string;
  latitud?: number | null;
  longitud?: number | null;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateProvinciaUseCase {
  constructor(private readonly provincias: ProvinciaRepository) {}

  async execute(
    idProvincia: number,
    input: UpdateProvinciaUseCaseInput,
  ): Promise<ProvinciaProps> {
    const existing = await this.provincias.findById(idProvincia);
    if (!existing) {
      throw new NotFoundError('Provincia no encontrada');
    }

    const updated = await this.provincias.update(idProvincia, {
      provincia: input.provincia?.trim(),
      latitud: input.latitud,
      longitud: input.longitud,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
