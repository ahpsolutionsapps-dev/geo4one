import { NotFoundError } from '../../../../core/errors/app-error';
import { CategoriaAnuncianteProps } from '../../domain/entities/categoria-anunciante';
import { CategoriaAnuncianteRepository } from '../../domain/repositories/categoria-anunciante-repository';

export class GetCategoriaAnuncianteByIdUseCase {
  constructor(private readonly categoriasAnunciantes: CategoriaAnuncianteRepository) {}

  async execute(idCategoriaAnunciante: number): Promise<CategoriaAnuncianteProps> {
    const categoriaAnunciante = await this.categoriasAnunciantes.findById(idCategoriaAnunciante);
    if (!categoriaAnunciante) {
      throw new NotFoundError('Categoría de anunciante no encontrada');
    }

    return categoriaAnunciante.toPrimitives();
  }
}