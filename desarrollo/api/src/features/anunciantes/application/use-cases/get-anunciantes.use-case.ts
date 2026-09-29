import { AnuncianteProps } from '../../domain/entities/anunciante';
import { AnuncianteRepository } from '../../domain/repositories/anunciante-repository';

export class GetAnunciantesUseCase {
  constructor(private readonly anunciantes: AnuncianteRepository) {}

  async execute(): Promise<AnuncianteProps[]> {
    const items = await this.anunciantes.findMany();
    return items.map((item) => item.toPrimitives());
  }
}
