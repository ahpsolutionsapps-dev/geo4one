import { ColocacionRepository, ElementoOption } from '../../domain/repositories/colocacion-repository';

export class GetElementosOptionsUseCase {
  constructor(private readonly colocaciones: ColocacionRepository) {}

  async execute(): Promise<ElementoOption[]> {
    return this.colocaciones.findElementosOptions();
  }
}
