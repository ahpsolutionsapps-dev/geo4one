import {
  AnuncianteRepository,
  SubSectorIndustrialOption,
} from '../../domain/repositories/anunciante-repository';

export class GetSubSectoresIndustrialesOptionsUseCase {
  constructor(private readonly anunciantes: AnuncianteRepository) {}

  async execute(idSectorIndustrial?: number): Promise<SubSectorIndustrialOption[]> {
    return this.anunciantes.findSubSectoresOptions(idSectorIndustrial);
  }
}
