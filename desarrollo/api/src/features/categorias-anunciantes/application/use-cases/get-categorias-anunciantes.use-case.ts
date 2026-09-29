import { CategoriaAnuncianteProps } from '../../domain/entities/categoria-anunciante';
import { CategoriaAnuncianteRepository } from '../../domain/repositories/categoria-anunciante-repository';

export class GetCategoriasAnunciantesUseCase {
  constructor(private readonly categoriasAnunciantes: CategoriaAnuncianteRepository) {}

  async execute(): Promise<CategoriaAnuncianteProps[]> {
    const rows = await this.categoriasAnunciantes.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}