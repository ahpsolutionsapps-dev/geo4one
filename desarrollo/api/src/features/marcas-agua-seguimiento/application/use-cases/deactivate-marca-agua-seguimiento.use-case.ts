import { NotFoundError } from '../../../../core/errors/app-error';
import { MarcaAguaSeguimientoRepository } from '../../domain/repositories/marca-agua-seguimiento-repository';

export class DeactivateMarcaAguaSeguimientoUseCase {
  constructor(private readonly marcasAguaSeguimiento: MarcaAguaSeguimientoRepository) {}

  async execute(idFirmaMarcaAguaSeguimiento: number, actualizadoPor: number): Promise<void> {
    const existing = await this.marcasAguaSeguimiento.findById(idFirmaMarcaAguaSeguimiento);
    if (!existing) {
      throw new NotFoundError('Marca de agua no encontrada');
    }

    await this.marcasAguaSeguimiento.deactivate(idFirmaMarcaAguaSeguimiento, actualizadoPor);
  }
}
