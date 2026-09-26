import { ConflictError, NotFoundError } from '../../../../core/errors/app-error';
import { ProvinciaRepository } from '../../../provincias/domain/repositories/provincia-repository';
import { MunicipioProps } from '../../domain/entities/municipio';
import { MunicipioRepository } from '../../domain/repositories/municipio-repository';

export interface CreateMunicipioUseCaseInput {
  idProvincia: number;
  municipio: string;
  latitud?: number | null;
  longitud?: number | null;
  creadoPor: number;
}

export class CreateMunicipioUseCase {
  constructor(
    private readonly municipios: MunicipioRepository,
    private readonly provincias: ProvinciaRepository,
  ) {}

  async execute(input: CreateMunicipioUseCaseInput): Promise<MunicipioProps> {
    const municipio = input.municipio.trim();
    const province = await this.provincias.findById(input.idProvincia);
    if (!province) {
      throw new NotFoundError('Provincia no encontrada');
    }

    const existing = await this.municipios.findByNombreInProvincia(
      input.idProvincia,
      municipio,
    );
    if (existing) {
      throw new ConflictError('Ya existe un municipio con ese nombre en esa provincia');
    }

    const created = await this.municipios.create({
      idProvincia: input.idProvincia,
      municipio,
      latitud: input.latitud ?? null,
      longitud: input.longitud ?? null,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
