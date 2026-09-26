import { ConflictError, NotFoundError } from '../../../../core/errors/app-error';
import { MunicipioRepository } from '../../../municipios/domain/repositories/municipio-repository';
import { SectorProps } from '../../domain/entities/sector';
import { SectorRepository } from '../../domain/repositories/sector-repository';

export interface UpdateSectorUseCaseInput {
  idMunicipio?: number;
  sectorBarrio?: string;
  circunscripcion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateSectorUseCase {
  constructor(
    private readonly sectores: SectorRepository,
    private readonly municipios: MunicipioRepository,
  ) {}

  async execute(
    idSectorBarrio: number,
    input: UpdateSectorUseCaseInput,
  ): Promise<SectorProps> {
    const existing = await this.sectores.findById(idSectorBarrio);
    if (!existing) {
      throw new NotFoundError('Sector no encontrado');
    }

    const existingData = existing.toPrimitives();

    const nextMunicipio = input.idMunicipio ?? existingData.idMunicipio;
    const nextSectorBarrio = input.sectorBarrio?.trim() ?? existingData.sectorBarrio;

    if (input.idMunicipio !== undefined) {
      const municipio = await this.municipios.findById(input.idMunicipio);
      if (!municipio) {
        throw new NotFoundError('Municipio no encontrado');
      }
    }

    const byName = await this.sectores.findByNombreInMunicipio(
      nextMunicipio,
      nextSectorBarrio,
    );
    if (byName && byName.toPrimitives().idSectorBarrio !== idSectorBarrio) {
      throw new ConflictError('Ya existe un sector con ese nombre en ese municipio');
    }

    const updated = await this.sectores.update(idSectorBarrio, {
      idMunicipio: input.idMunicipio,
      sectorBarrio: input.sectorBarrio?.trim(),
      circunscripcion: input.circunscripcion,
      latitud: input.latitud,
      longitud: input.longitud,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
