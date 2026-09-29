import { NotFoundError } from '../../../../core/errors/app-error';
import { VersionCampanaRepository } from '../../domain/repositories/version-campana-repository';

export class DeactivateVersionCampanaUseCase {
  constructor(private readonly versionesCampanas: VersionCampanaRepository) {}

  async execute(idVersionCampana: number, actualizadoPor: number): Promise<void> {
    const existing = await this.versionesCampanas.findById(idVersionCampana);
    if (!existing) {
      throw new NotFoundError('Version de campana no encontrada');
    }

    await this.versionesCampanas.deactivate(idVersionCampana, actualizadoPor);
  }
}
