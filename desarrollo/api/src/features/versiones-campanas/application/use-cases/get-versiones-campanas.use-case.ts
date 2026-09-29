import { VersionCampanaProps } from '../../domain/entities/version-campana';
import { VersionCampanaRepository } from '../../domain/repositories/version-campana-repository';

export class GetVersionesCampanasUseCase {
  constructor(private readonly versionesCampanas: VersionCampanaRepository) {}

  async execute(): Promise<VersionCampanaProps[]> {
    const items = await this.versionesCampanas.findMany();
    return items.map((item) => item.toPrimitives());
  }
}
