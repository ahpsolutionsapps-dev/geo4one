import { ConflictError, NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { MunicipioRepository } from '../../../municipios/domain/repositories/municipio-repository';
import { ProvinciaRepository } from '../../../provincias/domain/repositories/provincia-repository';
import { SectorRepository } from '../../../sectores/domain/repositories/sector-repository';
import { ProveedorProps } from '../../domain/entities/proveedor';
import { ProveedorRepository } from '../../domain/repositories/proveedor-repository';

export interface UpdateProveedorUseCaseInput {
  proveedor?: string;
  rnc?: string | null;
  personaContacto?: string | null;
  cargo?: string | null;
  email?: string | null;
  paginaWeb?: string | null;
  direccion?: string | null;
  idProvincia?: number | null;
  idMunicipio?: number | null;
  idSectorBarrio?: number | null;
  activo?: boolean;
  actualizadoPor: number;
}

export class UpdateProveedorUseCase {
  constructor(
    private readonly proveedores: ProveedorRepository,
    private readonly provincias: ProvinciaRepository,
    private readonly municipios: MunicipioRepository,
    private readonly sectores: SectorRepository,
  ) {}

  async execute(
    idProveedor: number,
    input: UpdateProveedorUseCaseInput,
  ): Promise<ProveedorProps> {
    const existing = await this.proveedores.findById(idProveedor);
    if (!existing) {
      throw new NotFoundError('Suplidor no encontrado');
    }

    const existingData = existing.toPrimitives();
    const nextRnc = input.rnc === undefined ? existingData.rnc : input.rnc?.trim() || null;
    const nextProvincia = input.idProvincia === undefined ? existingData.idProvincia : input.idProvincia;
    const nextMunicipio = input.idMunicipio === undefined ? existingData.idMunicipio : input.idMunicipio;
    const nextSector = input.idSectorBarrio === undefined ? existingData.idSectorBarrio : input.idSectorBarrio;

    if (nextRnc) {
      const existingByRnc = await this.proveedores.findByRnc(nextRnc);
      if (existingByRnc && existingByRnc.toPrimitives().idProveedor !== idProveedor) {
        throw new ConflictError('Ya existe un suplidor con ese RNC');
      }
    }

    if (nextProvincia) {
      const provincia = await this.provincias.findById(nextProvincia);
      if (!provincia) {
        throw new NotFoundError('Provincia no encontrada');
      }
    }

    if (nextMunicipio) {
      const municipio = await this.municipios.findById(nextMunicipio);
      if (!municipio) {
        throw new NotFoundError('Municipio no encontrado');
      }

      if (nextProvincia) {
        const municipioData = municipio.toPrimitives();
        if (municipioData.idProvincia !== nextProvincia) {
          throw new ValidationError('El municipio no pertenece a la provincia seleccionada');
        }
      }
    }

    if (nextSector) {
      const sector = await this.sectores.findById(nextSector);
      if (!sector) {
        throw new NotFoundError('Sector no encontrado');
      }

      if (nextMunicipio) {
        const sectorData = sector.toPrimitives();
        if (sectorData.idMunicipio !== nextMunicipio) {
          throw new ValidationError('El sector no pertenece al municipio seleccionado');
        }
      }
    }

    const updated = await this.proveedores.update(idProveedor, {
      proveedor: input.proveedor?.trim(),
      rnc: input.rnc === undefined ? undefined : input.rnc?.trim() || null,
      personaContacto:
        input.personaContacto === undefined
          ? undefined
          : input.personaContacto?.trim() || null,
      cargo: input.cargo === undefined ? undefined : input.cargo?.trim() || null,
      email: input.email === undefined ? undefined : input.email?.trim() || null,
      paginaWeb: input.paginaWeb === undefined ? undefined : input.paginaWeb?.trim() || null,
      direccion: input.direccion === undefined ? undefined : input.direccion?.trim() || null,
      idProvincia: input.idProvincia,
      idMunicipio: input.idMunicipio,
      idSectorBarrio: input.idSectorBarrio,
      activo: input.activo,
      actualizadoPor: input.actualizadoPor,
    });

    return updated.toPrimitives();
  }
}
