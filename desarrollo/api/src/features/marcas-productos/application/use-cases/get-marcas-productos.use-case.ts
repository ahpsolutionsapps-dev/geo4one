import { MarcaProductoProps } from '../../domain/entities/marca-producto';
import { MarcaProductoRepository } from '../../domain/repositories/marca-producto-repository';

export class GetMarcasProductosUseCase {
  constructor(private readonly marcasProductos: MarcaProductoRepository) {}

  async execute(): Promise<MarcaProductoProps[]> {
    const rows = await this.marcasProductos.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}