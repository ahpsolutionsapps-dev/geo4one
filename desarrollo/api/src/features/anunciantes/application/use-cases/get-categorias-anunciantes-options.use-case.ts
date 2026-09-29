import {
  AnuncianteRepository,
  CategoriaAnuncianteOption,
} from '../../domain/repositories/anunciante-repository';

export class GetCategoriasAnunciantesOptionsUseCase {
  constructor(private readonly anunciantes: AnuncianteRepository) {}

  async execute(idSubSectorIndustrial?: number): Promise<CategoriaAnuncianteOption[]> {
    return this.anunciantes.findCategoriasOptions(idSubSectorIndustrial);
  }
}
