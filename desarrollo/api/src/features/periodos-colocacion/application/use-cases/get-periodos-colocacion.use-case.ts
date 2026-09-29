import { PeriodoColocacionProps } from '../../domain/entities/periodo-colocacion';
import { PeriodoColocacionRepository } from '../../domain/repositories/periodo-colocacion-repository';

export class GetPeriodosColocacionUseCase {
  constructor(private readonly periodosColocacion: PeriodoColocacionRepository) {}

  async execute(): Promise<PeriodoColocacionProps[]> {
    const rows = await this.periodosColocacion.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}
