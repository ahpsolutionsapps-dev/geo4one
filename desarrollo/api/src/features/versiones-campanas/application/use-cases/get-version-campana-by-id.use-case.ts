import { NotFoundError } from '../../../../core/errors/app-error';
import { VersionCampanaProps } from '../../domain/entities/version-campana';
import { VersionCampanaRepository } from '../../domain/repositories/version-campana-repository';

export class GetVersionCampanaByIdUseCase {
  constructor(private readonly versionesCampanas: VersionCampanaRepository) {}

  async execute(idVersionCampana: number): Promise<VersionCampanaProps> {
    const item = await this.versionesCampanas.findById(idVersionCampana);

    if (!item) {
      throw new NotFoundError('Version de campana no encontrada');
    }

    return item.toPrimitives();
  }
}
