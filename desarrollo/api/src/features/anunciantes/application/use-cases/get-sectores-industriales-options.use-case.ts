import { AnuncianteRepository, SectorIndustrialOption } from '../../domain/repositories/anunciante-repository';

export class GetSectoresIndustrialesOptionsUseCase {
  constructor(private readonly anunciantes: AnuncianteRepository) {}

  async execute(): Promise<SectorIndustrialOption[]> {
    return this.anunciantes.findSectoresOptions();
  }
}
