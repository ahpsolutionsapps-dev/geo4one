import { NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { PeriodoColocacionProps } from '../../domain/entities/periodo-colocacion';
import { PeriodoColocacionRepository } from '../../domain/repositories/periodo-colocacion-repository';

export interface UpdatePeriodoColocacionUseCaseInput {
  fechaInicial?: Date;
  fechaFinal?: Date;
  generalesSeguimiento?: string | null;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdatePeriodoColocacionUseCase {
  constructor(private readonly periodosColocacion: PeriodoColocacionRepository) {}

  async execute(
    idPeriodoColocacion: number,
    input: UpdatePeriodoColocacionUseCaseInput,
  ): Promise<PeriodoColocacionProps> {
    const existing = await this.periodosColocacion.findById(idPeriodoColocacion);
    if (!existing) {
      throw new NotFoundError('Periodo de colocacion no encontrado');
    }

    const existingData = existing.toPrimitives();
    const nextFechaInicial = input.fechaInicial ?? existingData.fechaInicial;
    const nextFechaFinal = input.fechaFinal ?? existingData.fechaFinal;

    if (nextFechaFinal < nextFechaInicial) {
      throw new ValidationError('La fecha final no puede ser menor que la fecha inicial');
    }

    const updated = await this.periodosColocacion.update(idPeriodoColocacion, {
      fechaInicial: input.fechaInicial,
      fechaFinal: input.fechaFinal,
      generalesSeguimiento: input.generalesSeguimiento,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
