import { NotFoundError } from '../../../../core/errors/app-error';
import { ColocacionRepository } from '../../domain/repositories/colocacion-repository';

export class DeactivateColocacionUseCase {
  constructor(private readonly colocaciones: ColocacionRepository) {}

  async execute(idColocacion: number, actualizadoPor: number): Promise<void> {
    const existing = await this.colocaciones.findById(idColocacion);
    if (!existing) {
      throw new NotFoundError('Colocacion no encontrada');
    }

    await this.colocaciones.deactivate(idColocacion, actualizadoPor);
  }
}
