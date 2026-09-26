import { NotFoundError } from '../../../../core/errors/app-error';
import { ProveedorRepository } from '../../domain/repositories/proveedor-repository';

export class DeactivateProveedorUseCase {
  constructor(private readonly proveedores: ProveedorRepository) {}

  async execute(idProveedor: number, actualizadoPor: number): Promise<void> {
    const existing = await this.proveedores.findById(idProveedor);
    if (!existing) {
      throw new NotFoundError('Suplidor no encontrado');
    }

    await this.proveedores.deactivate(idProveedor, actualizadoPor);
  }
}
