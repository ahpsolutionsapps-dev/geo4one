import {
  ElementoRecord,
  FindElementosFilters,
  ElementoRepository,
} from '../../domain/repositories/elemento-repository';

export class GetElementosUseCase {
  constructor(private readonly elementos: ElementoRepository) {}

  async execute(filters?: FindElementosFilters): Promise<ElementoRecord[]> {
    return this.elementos.findMany(filters);
  }
}
