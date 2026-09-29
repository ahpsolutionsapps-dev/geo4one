import { ComboAnuncianteProps } from '../../domain/entities/combo-anunciante';
import { ComboAnuncianteRepository } from '../../domain/repositories/combo-anunciante-repository';

export class GetCombosAnunciantesUseCase {
  constructor(private readonly combosAnunciantes: ComboAnuncianteRepository) {}

  async execute(): Promise<ComboAnuncianteProps[]> {
    const rows = await this.combosAnunciantes.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}
