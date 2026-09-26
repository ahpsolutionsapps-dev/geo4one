import { MunicipioProps } from '../../domain/entities/municipio';
import { MunicipioRepository } from '../../domain/repositories/municipio-repository';

export class GetMunicipiosUseCase {
  constructor(private readonly municipios: MunicipioRepository) {}

  async execute(): Promise<MunicipioProps[]> {
    const rows = await this.municipios.findMany();
    return rows.map((row) => row.toPrimitives());
  }
}
