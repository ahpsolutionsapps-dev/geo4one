import { NotFoundError } from '../../../../core/errors/app-error';
import { AnuncianteProps } from '../../domain/entities/anunciante';
import { AnuncianteRepository } from '../../domain/repositories/anunciante-repository';

export class GetAnuncianteByIdUseCase {
  constructor(private readonly anunciantes: AnuncianteRepository) {}

  async execute(idAnunciante: number): Promise<AnuncianteProps> {
    const item = await this.anunciantes.findById(idAnunciante);
    if (!item) {
      throw new NotFoundError('Anunciante no encontrado');
    }

    return item.toPrimitives();
  }
}
