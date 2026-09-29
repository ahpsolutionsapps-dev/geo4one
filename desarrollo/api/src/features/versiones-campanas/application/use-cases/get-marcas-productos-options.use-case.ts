import { MarcaProductoOption, VersionCampanaRepository } from '../../domain/repositories/version-campana-repository';

export class GetMarcasProductosOptionsUseCase {
  constructor(private readonly versionesCampanas: VersionCampanaRepository) {}

  async execute(idAnunciante?: number): Promise<MarcaProductoOption[]> {
    return this.versionesCampanas.findMarcasProductosOptions(idAnunciante);
  }
}
