import {
  ColocacionRepository,
  PeriodoColocacionOption,
} from '../../domain/repositories/colocacion-repository';

export class GetPeriodosOptionsUseCase {
  constructor(private readonly colocaciones: ColocacionRepository) {}

  async execute(): Promise<PeriodoColocacionOption[]> {
    return this.colocaciones.findPeriodosOptions();
  }
}
