import { ComboAnuncianteRepository, ComboMarcaProductoOption } from '../../domain/repositories/combo-anunciante-repository';

export class GetComboMarcasOptionsUseCase {
  constructor(private readonly combosAnunciantes: ComboAnuncianteRepository) {}

  async execute(): Promise<ComboMarcaProductoOption[]> {
    return this.combosAnunciantes.findMarcaProductoOptions();
  }
}
