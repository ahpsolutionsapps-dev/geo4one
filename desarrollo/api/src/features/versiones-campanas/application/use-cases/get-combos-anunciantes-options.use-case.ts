import {
  ComboAnuncianteOption,
  VersionCampanaRepository,
} from '../../domain/repositories/version-campana-repository';

export class GetCombosAnunciantesOptionsUseCase {
  constructor(private readonly versionesCampanas: VersionCampanaRepository) {}

  async execute(): Promise<ComboAnuncianteOption[]> {
    return this.versionesCampanas.findCombosAnunciantesOptions();
  }
}
