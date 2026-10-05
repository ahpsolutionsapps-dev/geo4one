import { ConflictError, NotFoundError } from '../../../../core/errors/app-error';
import { ProvinciaRepository } from '../../../provincias/domain/repositories/provincia-repository';
import { MunicipioProps } from '../../domain/entities/municipio';
import { MunicipioRepository } from '../../domain/repositories/municipio-repository';

export interface UpdateMunicipioUseCaseInput {
  idProvincia?: number;
  municipio?: string;
  latitud?: number | null;
  longitud?: number | null;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateMunicipioUseCase {
  constructor(
    private readonly municipios: MunicipioRepository,
    private readonly provincias: ProvinciaRepository,
  ) {}

  async execute(
    idMunicipio: number,
    input: UpdateMunicipioUseCaseInput,
  ): Promise<MunicipioProps> {
    const existing = await this.municipios.findById(idMunicipio);
    if (!existing) {
      throw new NotFoundError('Municipio no encontrado');
    }

    const existingProps = existing.toPrimitives();

    const nextProvincia = input.idProvincia ?? existingProps.idProvincia;
    const nextMunicipio = input.municipio?.trim() ?? existingProps.municipio;

    if (input.idProvincia !== undefined) {
      const province = await this.provincias.findById(input.idProvincia);
      if (!province) {
        throw new NotFoundError('Provincia no encontrada');
      }
    }

    const byName = await this.municipios.findByNombreInProvincia(
      nextProvincia,
      nextMunicipio,
    );
    if (byName && byName.idMunicipio !== idMunicipio) {
      throw new ConflictError('Ya existe un municipio con ese nombre en esa provincia');
    }

    const updated = await this.municipios.update(idMunicipio, {
      idProvincia: nextProvincia,
      municipio: nextMunicipio,
      latitud: input.latitud,
      longitud: input.longitud,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
