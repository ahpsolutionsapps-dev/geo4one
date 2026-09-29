import { ValidationError } from '../../../../core/errors/app-error';
import { PeriodoColocacionProps } from '../../domain/entities/periodo-colocacion';
import { PeriodoColocacionRepository } from '../../domain/repositories/periodo-colocacion-repository';

export interface CreatePeriodoColocacionUseCaseInput {
  fechaInicial: Date;
  fechaFinal: Date;
  generalesSeguimiento?: string | null;
  creadoPor: number;
}

export class CreatePeriodoColocacionUseCase {
  constructor(private readonly periodosColocacion: PeriodoColocacionRepository) {}

  async execute(input: CreatePeriodoColocacionUseCaseInput): Promise<PeriodoColocacionProps> {
    if (input.fechaFinal < input.fechaInicial) {
      throw new ValidationError('La fecha final no puede ser menor que la fecha inicial');
    }

    const created = await this.periodosColocacion.create({
      fechaInicial: input.fechaInicial,
      fechaFinal: input.fechaFinal,
      generalesSeguimiento: input.generalesSeguimiento,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
