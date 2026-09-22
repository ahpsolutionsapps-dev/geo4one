import {
  ElementoRecord,
  ElementoRepository,
  UpdateElementoInput,
} from '../../domain/repositories/elemento-repository';

export class UpdateElementoUseCase {
  constructor(private readonly elementos: ElementoRepository) {}

  async execute(idElemento: number, input: UpdateElementoInput): Promise<ElementoRecord> {
    return this.elementos.update(idElemento, input);
  }
}
