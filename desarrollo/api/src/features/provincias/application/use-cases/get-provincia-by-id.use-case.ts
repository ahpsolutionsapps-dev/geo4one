import { NotFoundError } from '../../../../core/errors/app-error';
import { ProvinciaProps } from '../../domain/entities/provincia';
import { ProvinciaRepository } from '../../domain/repositories/provincia-repository';

export class GetProvinciaByIdUseCase {
  constructor(private readonly provincias: ProvinciaRepository) {}

  async execute(idProvincia: number): Promise<ProvinciaProps> {
    const provincia = await this.provincias.findById(idProvincia);
    if (!provincia) {
      throw new NotFoundError('Provincia no encontrada');
    }

    return provincia.toPrimitives();
  }
}
