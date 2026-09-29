import { ColocacionProps } from '../../domain/entities/colocacion';
import { ColocacionRepository } from '../../domain/repositories/colocacion-repository';

export class GetColocacionesUseCase {
  constructor(private readonly colocaciones: ColocacionRepository) {}

  async execute(): Promise<ColocacionProps[]> {
    const items = await this.colocaciones.findMany();
    return items.map((item) => item.toPrimitives());
  }
}
