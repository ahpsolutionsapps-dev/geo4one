import { MarcaAguaSeguimientoProps } from '../../domain/entities/marca-agua-seguimiento';
import { MarcaAguaSeguimientoRepository } from '../../domain/repositories/marca-agua-seguimiento-repository';

export class GetMarcasAguaSeguimientoUseCase {
  constructor(private readonly marcasAguaSeguimiento: MarcaAguaSeguimientoRepository) {}

  async execute(): Promise<MarcaAguaSeguimientoProps[]> {
    const rows = await this.marcasAguaSeguimiento.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}
