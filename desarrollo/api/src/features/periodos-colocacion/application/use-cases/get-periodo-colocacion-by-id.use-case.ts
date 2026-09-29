import { NotFoundError } from '../../../../core/errors/app-error';
import { PeriodoColocacionProps } from '../../domain/entities/periodo-colocacion';
import { PeriodoColocacionRepository } from '../../domain/repositories/periodo-colocacion-repository';

export class GetPeriodoColocacionByIdUseCase {
  constructor(private readonly periodosColocacion: PeriodoColocacionRepository) {}

  async execute(idPeriodoColocacion: number): Promise<PeriodoColocacionProps> {
    const periodoColocacion = await this.periodosColocacion.findById(idPeriodoColocacion);
    if (!periodoColocacion) {
      throw new NotFoundError('Periodo de colocacion no encontrado');
    }

    return periodoColocacion.toPrimitives();
  }
}
