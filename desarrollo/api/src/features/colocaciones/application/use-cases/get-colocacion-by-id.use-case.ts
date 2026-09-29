import { NotFoundError } from '../../../../core/errors/app-error';
import { ColocacionProps } from '../../domain/entities/colocacion';
import { ColocacionRepository } from '../../domain/repositories/colocacion-repository';

export class GetColocacionByIdUseCase {
  constructor(private readonly colocaciones: ColocacionRepository) {}

  async execute(idColocacion: number): Promise<ColocacionProps> {
    const item = await this.colocaciones.findById(idColocacion);
    if (!item) {
      throw new NotFoundError('Colocacion no encontrada');
    }

    return item.toPrimitives();
  }
}
