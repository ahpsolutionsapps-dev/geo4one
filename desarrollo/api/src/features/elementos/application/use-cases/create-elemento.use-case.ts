import {
  CreateElementoInput,
  ElementoRecord,
  ElementoRepository,
} from '../../domain/repositories/elemento-repository';

export class CreateElementoUseCase {
  constructor(private readonly elementos: ElementoRepository) {}

  async execute(input: CreateElementoInput): Promise<ElementoRecord> {
    return this.elementos.create(input);
  }
}
