import { AnuncianteOption, VersionCampanaRepository } from '../../domain/repositories/version-campana-repository';

export class GetAnunciantesOptionsUseCase {
  constructor(private readonly versionesCampanas: VersionCampanaRepository) {}

  async execute(): Promise<AnuncianteOption[]> {
    return this.versionesCampanas.findAnunciantesOptions();
  }
}
