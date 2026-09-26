import { NotFoundError } from '../../../../core/errors/app-error';
import { ProvinciaRepository } from '../../domain/repositories/provincia-repository';

export class DeactivateProvinciaUseCase {
  constructor(private readonly provincias: ProvinciaRepository) {}

  async execute(idProvincia: number, actualizadoPor: number): Promise<void> {
    const existing = await this.provincias.findById(idProvincia);
    if (!existing) {
      throw new NotFoundError('Provincia no encontrada');
    }

    await this.provincias.deactivate(idProvincia, actualizadoPor);
  }
}
