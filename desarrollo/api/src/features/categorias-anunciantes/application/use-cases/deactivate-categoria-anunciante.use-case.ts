import { NotFoundError } from '../../../../core/errors/app-error';
import { CategoriaAnuncianteRepository } from '../../domain/repositories/categoria-anunciante-repository';

export class DeactivateCategoriaAnuncianteUseCase {
  constructor(private readonly categoriasAnunciantes: CategoriaAnuncianteRepository) {}

  async execute(idCategoriaAnunciante: number, actualizadoPor: number): Promise<void> {
    const existing = await this.categoriasAnunciantes.findById(idCategoriaAnunciante);
    if (!existing) {
      throw new NotFoundError('Categoría de anunciante no encontrada');
    }

    await this.categoriasAnunciantes.deactivate(idCategoriaAnunciante, actualizadoPor);
  }
}