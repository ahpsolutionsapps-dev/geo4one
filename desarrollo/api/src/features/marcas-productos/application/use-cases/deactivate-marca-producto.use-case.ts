import { NotFoundError } from '../../../../core/errors/app-error';
import { MarcaProductoRepository } from '../../domain/repositories/marca-producto-repository';

export class DeactivateMarcaProductoUseCase {
  constructor(private readonly marcasProductos: MarcaProductoRepository) {}

  async execute(idMarcaProducto: number, actualizadoPor: number): Promise<void> {
    const existing = await this.marcasProductos.findById(idMarcaProducto);
    if (!existing) {
      throw new NotFoundError('Marca / producto no encontrado');
    }

    await this.marcasProductos.deactivate(idMarcaProducto, actualizadoPor);
  }
}