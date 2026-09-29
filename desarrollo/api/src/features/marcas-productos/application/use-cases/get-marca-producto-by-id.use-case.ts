import { NotFoundError } from '../../../../core/errors/app-error';
import { MarcaProductoProps } from '../../domain/entities/marca-producto';
import { MarcaProductoRepository } from '../../domain/repositories/marca-producto-repository';

export class GetMarcaProductoByIdUseCase {
  constructor(private readonly marcasProductos: MarcaProductoRepository) {}

  async execute(idMarcaProducto: number): Promise<MarcaProductoProps> {
    const marcaProducto = await this.marcasProductos.findById(idMarcaProducto);
    if (!marcaProducto) {
      throw new NotFoundError('Marca / producto no encontrado');
    }

    return marcaProducto.toPrimitives();
  }
}