import { NotFoundError } from '../../../../core/errors/app-error';
import { SectorProps } from '../../domain/entities/sector';
import { SectorRepository } from '../../domain/repositories/sector-repository';

export class GetSectorByIdUseCase {
  constructor(private readonly sectores: SectorRepository) {}

  async execute(idSectorBarrio: number): Promise<SectorProps> {
    const sector = await this.sectores.findById(idSectorBarrio);
    if (!sector) {
      throw new NotFoundError('Sector no encontrado');
    }

    return sector.toPrimitives();
  }
}
