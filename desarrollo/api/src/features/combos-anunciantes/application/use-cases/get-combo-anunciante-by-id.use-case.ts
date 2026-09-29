import { NotFoundError } from '../../../../core/errors/app-error';
import { ComboAnuncianteProps } from '../../domain/entities/combo-anunciante';
import { ComboAnuncianteRepository } from '../../domain/repositories/combo-anunciante-repository';

export class GetComboAnuncianteByIdUseCase {
  constructor(private readonly combosAnunciantes: ComboAnuncianteRepository) {}

  async execute(idComboAnunciante: number): Promise<ComboAnuncianteProps> {
    const comboAnunciante = await this.combosAnunciantes.findById(idComboAnunciante);
    if (!comboAnunciante) {
      throw new NotFoundError('Combo de anunciante no encontrado');
    }

    return comboAnunciante.toPrimitives();
  }
}
