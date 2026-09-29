import { NotFoundError } from '../../../../core/errors/app-error';
import { PeriodoColocacionRepository } from '../../domain/repositories/periodo-colocacion-repository';

export class DeactivatePeriodoColocacionUseCase {
  constructor(private readonly periodosColocacion: PeriodoColocacionRepository) {}

  async execute(idPeriodoColocacion: number, actualizadoPor: number): Promise<void> {
    const existing = await this.periodosColocacion.findById(idPeriodoColocacion);
    if (!existing) {
      throw new NotFoundError('Periodo de colocacion no encontrado');
    }

    await this.periodosColocacion.deactivate(idPeriodoColocacion, actualizadoPor);
  }
}
