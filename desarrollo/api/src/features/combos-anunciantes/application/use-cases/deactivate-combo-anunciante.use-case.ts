import { NotFoundError } from '../../../../core/errors/app-error';
import { ComboAnuncianteRepository } from '../../domain/repositories/combo-anunciante-repository';

export class DeactivateComboAnuncianteUseCase {
  constructor(private readonly combosAnunciantes: ComboAnuncianteRepository) {}

  async execute(idComboAnunciante: number, actualizadoPor: number): Promise<void> {
    const existing = await this.combosAnunciantes.findById(idComboAnunciante);
    if (!existing) {
      throw new NotFoundError('Combo de anunciante no encontrado');
    }

    await this.combosAnunciantes.deactivate(idComboAnunciante, actualizadoPor);
  }
}
