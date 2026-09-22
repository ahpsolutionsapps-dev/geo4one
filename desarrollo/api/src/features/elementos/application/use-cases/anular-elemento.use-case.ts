import { ElementoRepository } from '../../domain/repositories/elemento-repository';

export class AnularElementoUseCase {
  constructor(private readonly elementos: ElementoRepository) {}

  async execute(idElemento: number, idUsuarioAnula: number) {
    return this.elementos.softDelete(idElemento, idUsuarioAnula);
  }
}
