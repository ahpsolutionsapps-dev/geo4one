import { NotFoundError } from '../../../../core/errors/app-error';
import { MarcaAguaSeguimientoProps } from '../../domain/entities/marca-agua-seguimiento';
import { MarcaAguaSeguimientoRepository } from '../../domain/repositories/marca-agua-seguimiento-repository';

export class GetMarcaAguaSeguimientoByIdUseCase {
  constructor(private readonly marcasAguaSeguimiento: MarcaAguaSeguimientoRepository) {}

  async execute(idFirmaMarcaAguaSeguimiento: number): Promise<MarcaAguaSeguimientoProps> {
    const marcaAgua = await this.marcasAguaSeguimiento.findById(idFirmaMarcaAguaSeguimiento);
    if (!marcaAgua) {
      throw new NotFoundError('Marca de agua no encontrada');
    }

    return marcaAgua.toPrimitives();
  }
}
