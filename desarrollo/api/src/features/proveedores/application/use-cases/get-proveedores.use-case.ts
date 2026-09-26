import { ProveedorProps } from '../../domain/entities/proveedor';
import { ProveedorRepository } from '../../domain/repositories/proveedor-repository';

export class GetProveedoresUseCase {
  constructor(private readonly proveedores: ProveedorRepository) {}

  async execute(): Promise<ProveedorProps[]> {
    const items = await this.proveedores.findMany();
    return items.map((item) => item.toPrimitives());
  }
}
