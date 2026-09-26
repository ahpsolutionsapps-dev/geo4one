import { NotFoundError } from '../../../../core/errors/app-error';
import { MunicipioRepository } from '../../domain/repositories/municipio-repository';

export class DeactivateMunicipioUseCase {
  constructor(private readonly municipios: MunicipioRepository) {}

  async execute(idMunicipio: number, actualizadoPor: number): Promise<void> {
    const existing = await this.municipios.findById(idMunicipio);
    if (!existing) {
      throw new NotFoundError('Municipio no encontrado');
    }

    await this.municipios.deactivate(idMunicipio, actualizadoPor);
  }
}
