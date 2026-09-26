import { NotFoundError } from '../../../../core/errors/app-error';
import { ProveedorProps } from '../../domain/entities/proveedor';
import { ProveedorRepository } from '../../domain/repositories/proveedor-repository';

export class GetProveedorByIdUseCase {
  constructor(private readonly proveedores: ProveedorRepository) {}

  async execute(idProveedor: number): Promise<ProveedorProps> {
    const item = await this.proveedores.findById(idProveedor);
    if (!item) {
      throw new NotFoundError('Suplidor no encontrado');
    }

    return item.toPrimitives();
  }
}
