import {
  ElementoRecord,
  ElementoRepository,
} from '../../domain/repositories/elemento-repository';

export class GetElementoByIdUseCase {
  constructor(private readonly elementos: ElementoRepository) {}

  async execute(idElemento: number): Promise<ElementoRecord | null> {
    return this.elementos.findById(idElemento);
  }
}
