import { ConflictError, NotFoundError } from '../../../../core/errors/app-error';
import { MunicipioRepository } from '../../../municipios/domain/repositories/municipio-repository';
import { SectorProps } from '../../domain/entities/sector';
import { SectorRepository } from '../../domain/repositories/sector-repository';

export interface CreateSectorUseCaseInput {
  idMunicipio: number;
  sectorBarrio: string;
  circunscripcion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  creadoPor: number;
}

export class CreateSectorUseCase {
  constructor(
    private readonly sectores: SectorRepository,
    private readonly municipios: MunicipioRepository,
  ) {}

  async execute(input: CreateSectorUseCaseInput): Promise<SectorProps> {
    const sectorBarrio = input.sectorBarrio.trim();
    const municipio = await this.municipios.findById(input.idMunicipio);
    if (!municipio) {
      throw new NotFoundError('Municipio no encontrado');
    }

    const existing = await this.sectores.findByNombreInMunicipio(
      input.idMunicipio,
      sectorBarrio,
    );
    if (existing) {
      throw new ConflictError('Ya existe un sector con ese nombre en ese municipio');
    }

    const created = await this.sectores.create({
      idMunicipio: input.idMunicipio,
      sectorBarrio,
      circunscripcion: input.circunscripcion ?? null,
      latitud: input.latitud ?? null,
      longitud: input.longitud ?? null,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
