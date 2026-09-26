import { NotFoundError } from '../../../../core/errors/app-error';
import { MunicipioProps } from '../../domain/entities/municipio';
import { MunicipioRepository } from '../../domain/repositories/municipio-repository';

export class GetMunicipioByIdUseCase {
  constructor(private readonly municipios: MunicipioRepository) {}

  async execute(idMunicipio: number): Promise<MunicipioProps> {
    const municipio = await this.municipios.findById(idMunicipio);
    if (!municipio) {
      throw new NotFoundError('Municipio no encontrado');
    }

    return municipio.toPrimitives();
  }
}
