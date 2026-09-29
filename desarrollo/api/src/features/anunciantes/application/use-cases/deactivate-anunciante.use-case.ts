import { NotFoundError } from '../../../../core/errors/app-error';
import { AnuncianteRepository } from '../../domain/repositories/anunciante-repository';

export class DeactivateAnuncianteUseCase {
  constructor(private readonly anunciantes: AnuncianteRepository) {}

  async execute(idAnunciante: number, actualizadoPor: number): Promise<void> {
    const existing = await this.anunciantes.findById(idAnunciante);
    if (!existing) {
      throw new NotFoundError('Anunciante no encontrado');
    }

    await this.anunciantes.deactivate(idAnunciante, actualizadoPor);
  }
}
