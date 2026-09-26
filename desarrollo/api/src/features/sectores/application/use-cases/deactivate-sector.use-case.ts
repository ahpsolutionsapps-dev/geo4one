import { NotFoundError } from '../../../../core/errors/app-error';
import { SectorRepository } from '../../domain/repositories/sector-repository';

export class DeactivateSectorUseCase {
  constructor(private readonly sectores: SectorRepository) {}

  async execute(idSectorBarrio: number, actualizadoPor: number): Promise<void> {
    const existing = await this.sectores.findById(idSectorBarrio);
    if (!existing) {
      throw new NotFoundError('Sector no encontrado');
    }

    await this.sectores.deactivate(idSectorBarrio, actualizadoPor);
  }
}
