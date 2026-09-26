import { ConflictError, NotFoundError, ValidationError } from '../../../../core/errors/app-error';
import { MunicipioRepository } from '../../../municipios/domain/repositories/municipio-repository';
import { ProvinciaRepository } from '../../../provincias/domain/repositories/provincia-repository';
import { SectorRepository } from '../../../sectores/domain/repositories/sector-repository';
import { ProveedorProps } from '../../domain/entities/proveedor';
import { ProveedorRepository } from '../../domain/repositories/proveedor-repository';

export interface CreateProveedorUseCaseInput {
  proveedor: string;
  rnc?: string | null;
  personaContacto?: string | null;
  cargo?: string | null;
  email?: string | null;
  paginaWeb?: string | null;
  direccion?: string | null;
  idProvincia?: number | null;
  idMunicipio?: number | null;
  idSectorBarrio?: number | null;
  creadoPor: number;
}

export class CreateProveedorUseCase {
  constructor(
    private readonly proveedores: ProveedorRepository,
    private readonly provincias: ProvinciaRepository,
    private readonly municipios: MunicipioRepository,
    private readonly sectores: SectorRepository,
  ) {}

  async execute(input: CreateProveedorUseCaseInput): Promise<ProveedorProps> {
    const proveedor = input.proveedor.trim();
    const rnc = input.rnc?.trim() ? input.rnc.trim() : null;

    if (rnc) {
      const existingByRnc = await this.proveedores.findByRnc(rnc);
      if (existingByRnc) {
        throw new ConflictError('Ya existe un suplidor con ese RNC');
      }
    }

    if (input.idProvincia) {
      const provincia = await this.provincias.findById(input.idProvincia);
      if (!provincia) {
        throw new NotFoundError('Provincia no encontrada');
      }
    }

    if (input.idMunicipio) {
      const municipio = await this.municipios.findById(input.idMunicipio);
      if (!municipio) {
        throw new NotFoundError('Municipio no encontrado');
      }

      if (input.idProvincia) {
        const municipioData = municipio.toPrimitives();
        if (municipioData.idProvincia !== input.idProvincia) {
          throw new ValidationError('El municipio no pertenece a la provincia seleccionada');
        }
      }
    }

    if (input.idSectorBarrio) {
      const sector = await this.sectores.findById(input.idSectorBarrio);
      if (!sector) {
        throw new NotFoundError('Sector no encontrado');
      }

      if (input.idMunicipio) {
        const sectorData = sector.toPrimitives();
        if (sectorData.idMunicipio !== input.idMunicipio) {
          throw new ValidationError('El sector no pertenece al municipio seleccionado');
        }
      }
    }

    const created = await this.proveedores.create({
      proveedor,
      rnc,
      personaContacto: input.personaContacto?.trim() ? input.personaContacto.trim() : null,
      cargo: input.cargo?.trim() ? input.cargo.trim() : null,
      email: input.email?.trim() ? input.email.trim() : null,
      paginaWeb: input.paginaWeb?.trim() ? input.paginaWeb.trim() : null,
      direccion: input.direccion?.trim() ? input.direccion.trim() : null,
      idProvincia: input.idProvincia ?? null,
      idMunicipio: input.idMunicipio ?? null,
      idSectorBarrio: input.idSectorBarrio ?? null,
      creadoPor: input.creadoPor,
    });

    return created.toPrimitives();
  }
}
