import { PrismaClient } from '@prisma/client';
import {
  CatalogoSimpleInput,
  CatalogoSimpleRecord,
  CatalogoSimpleUpdateInput,
  CreateElementoInput,
  ElementoRecord,
  ElementoRepository,
  FindElementosFilters,
  FormatoCatalogoInput,
  FormatoCatalogoRecord,
  FormatoCatalogoUpdateInput,
  UpdateElementoInput,
} from '../../domain/repositories/elemento-repository';

function mapRow(row: any): ElementoRecord {
  return {
    idElemento: Number(row.IdElemento),
    idProveedor: Number(row.IdProveedor),
    licencia: row.Licencia ?? null,
    fechaEmision: row.FechaEmision ?? null,
    fechaVencimiento: row.FechaVencimiento ?? null,
    idSeguimiento: row.IdSeguimiento ?? null,
    idTipoElemento: Number(row.IdTipoElemento),
    idFormato: row.IdFormato ? Number(row.IdFormato) : null,
    idTamano: row.IdTamano ? Number(row.IdTamano) : null,
    activo: Boolean(row.Activo),
    costoAlquiler: row.CostoAlquiler ?? null,
    direccion: row.Direccion ?? null,
    idOrientacion: row.IdOrientacion ? Number(row.IdOrientacion) : null,
    idProvincia: row.IdProvincia ? Number(row.IdProvincia) : null,
    idMunicipio: row.IdMunicipio ? Number(row.IdMunicipio) : null,
    idSectorBarrio: row.IdSectorBarrio ? Number(row.IdSectorBarrio) : null,
    circunscripcion: row.Circunscripcion ?? null,
    latitud: row.Latitud ?? null,
    longitud: row.Longitud ?? null,
    anulado: Boolean(row.Anulado),
    anuladoPor: row.AnuladoPor ? Number(row.AnuladoPor) : null,
    comentarioAnulado: row.ComentarioAnulado ?? null,
    fechaAnulacion: row.FechaAnulacion ?? null,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor ? Number(row.CreadoPor) : null,
    actualizadoPor: row.ActualizadoPor ? Number(row.ActualizadoPor) : null,
  };
}

function mapCatalogoSimpleRow(row: any, idKey: string, nameKey: string): CatalogoSimpleRecord {
  return {
    id: Number(row[idKey]),
    nombre: String(row[nameKey]),
    activo: Boolean(row.Activo),
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  };
}

function mapFormatoCatalogoRow(row: any): FormatoCatalogoRecord {
  return {
    id: Number(row.IdFormato),
    idTipoElemento: Number(row.IdTipoElemento),
    tipoElemento: row.TiposElementos.TipoElemento,
    nombre: row.Formato,
    activo: Boolean(row.Activo),
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  };
}

export class PrismaElementoRepository implements ElementoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(filters?: FindElementosFilters): Promise<ElementoRecord[]> {
    const rows = await this.prisma.elementos.findMany({
      where: {
        ...(filters?.includeAnulados === true ? {} : { Anulado: false }),
        ...(filters?.activo !== undefined ? { Activo: filters.activo } : {}),
        ...(filters?.idProveedor ? { IdProveedor: BigInt(filters.idProveedor) } : {}),
        ...(filters?.idTipoElemento ? { IdTipoElemento: BigInt(filters.idTipoElemento) } : {}),
        ...(filters?.termino
          ? {
              OR: [
                { Licencia: { contains: filters.termino, mode: 'insensitive' } },
                { IdSeguimiento: { contains: filters.termino, mode: 'insensitive' } },
                { Direccion: { contains: filters.termino, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { FechaCreacion: 'desc' },
      select: {
        IdElemento: true,
        IdProveedor: true,
        Licencia: true,
        FechaEmision: true,
        FechaVencimiento: true,
        IdSeguimiento: true,
        IdTipoElemento: true,
        IdFormato: true,
        IdTamano: true,
        Activo: true,
        CostoAlquiler: true,
        Direccion: true,
        IdOrientacion: true,
        IdProvincia: true,
        IdMunicipio: true,
        IdSectorBarrio: true,
        Circunscripcion: true,
        Latitud: true,
        Longitud: true,
        Anulado: true,
        AnuladoPor: true,
        ComentarioAnulado: true,
        FechaAnulacion: true,
        FechaCreacion: true,
        FechaActualizacion: true,
        CreadoPor: true,
        ActualizadoPor: true,
      },
    });

    return rows.map(mapRow);
  }

  async findById(idElemento: number): Promise<ElementoRecord | null> {
    const row = await this.prisma.elementos.findUnique({
      where: { IdElemento: BigInt(idElemento) },
      select: {
        IdElemento: true,
        IdProveedor: true,
        Licencia: true,
        FechaEmision: true,
        FechaVencimiento: true,
        IdSeguimiento: true,
        IdTipoElemento: true,
        IdFormato: true,
        IdTamano: true,
        Activo: true,
        CostoAlquiler: true,
        Direccion: true,
        IdOrientacion: true,
        IdProvincia: true,
        IdMunicipio: true,
        IdSectorBarrio: true,
        Circunscripcion: true,
        Latitud: true,
        Longitud: true,
        Anulado: true,
        AnuladoPor: true,
        ComentarioAnulado: true,
        FechaAnulacion: true,
        FechaCreacion: true,
        FechaActualizacion: true,
        CreadoPor: true,
        ActualizadoPor: true,
      },
    });

    return row ? mapRow(row) : null;
  }

  async create(input: CreateElementoInput): Promise<ElementoRecord> {
    const row = await this.prisma.elementos.create({
      data: {
        IdProveedor: BigInt(input.idProveedor),
        Licencia: input.licencia ?? undefined,
        FechaEmision: input.fechaEmision ? new Date(input.fechaEmision) : undefined,
        FechaVencimiento: input.fechaVencimiento ? new Date(input.fechaVencimiento) : undefined,
        IdSeguimiento: input.idSeguimiento ?? undefined,
        IdTipoElemento: BigInt(input.idTipoElemento),
        IdFormato: input.idFormato ? BigInt(input.idFormato) : undefined,
        IdTamano: input.idTamano ? BigInt(input.idTamano) : undefined,
        Activo: input.activo ?? true,
        CostoAlquiler: input.costoAlquiler !== undefined && input.costoAlquiler !== null ? Number(input.costoAlquiler) : undefined,
        Direccion: input.direccion ?? undefined,
        IdOrientacion: input.idOrientacion ? BigInt(input.idOrientacion) : undefined,
        IdProvincia: input.idProvincia ? BigInt(input.idProvincia) : undefined,
        IdMunicipio: input.idMunicipio ? BigInt(input.idMunicipio) : undefined,
        IdSectorBarrio: input.idSectorBarrio ? BigInt(input.idSectorBarrio) : undefined,
        Circunscripcion: input.circunscripcion ?? undefined,
        Latitud: input.latitud !== undefined && input.latitud !== null ? Number(input.latitud) : undefined,
        Longitud: input.longitud !== undefined && input.longitud !== null ? Number(input.longitud) : undefined,
        CreadoPor: input.idUsuarioRegistra ?? undefined,
      },
      select: {
        IdElemento: true,
        IdProveedor: true,
        Licencia: true,
        FechaEmision: true,
        FechaVencimiento: true,
        IdSeguimiento: true,
        IdTipoElemento: true,
        IdFormato: true,
        IdTamano: true,
        Activo: true,
        CostoAlquiler: true,
        Direccion: true,
        IdOrientacion: true,
        IdProvincia: true,
        IdMunicipio: true,
        IdSectorBarrio: true,
        Circunscripcion: true,
        Latitud: true,
        Longitud: true,
        Anulado: true,
        AnuladoPor: true,
        ComentarioAnulado: true,
        FechaAnulacion: true,
        FechaCreacion: true,
        FechaActualizacion: true,
        CreadoPor: true,
        ActualizadoPor: true,
      },
    });

    return mapRow(row);
  }

  async update(idElemento: number, input: UpdateElementoInput): Promise<ElementoRecord> {
    const row = await this.prisma.elementos.update({
      where: { IdElemento: BigInt(idElemento) },
      data: {
        ...(input.idProveedor !== undefined ? { IdProveedor: BigInt(input.idProveedor) } : {}),
        ...(input.licencia !== undefined ? { Licencia: input.licencia ?? null } : {}),
        ...(input.fechaEmision !== undefined ? { FechaEmision: input.fechaEmision ? new Date(input.fechaEmision) : null } : {}),
        ...(input.fechaVencimiento !== undefined ? { FechaVencimiento: input.fechaVencimiento ? new Date(input.fechaVencimiento) : null } : {}),
        ...(input.idSeguimiento !== undefined ? { IdSeguimiento: input.idSeguimiento ?? null } : {}),
        ...(input.idTipoElemento !== undefined ? { IdTipoElemento: BigInt(input.idTipoElemento) } : {}),
        ...(input.idFormato !== undefined ? { IdFormato: input.idFormato ? BigInt(input.idFormato) : null } : {}),
        ...(input.idTamano !== undefined ? { IdTamano: input.idTamano ? BigInt(input.idTamano) : null } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        ...(input.costoAlquiler !== undefined ? { CostoAlquiler: input.costoAlquiler !== null ? Number(input.costoAlquiler) : null } : {}),
        ...(input.direccion !== undefined ? { Direccion: input.direccion ?? null } : {}),
        ...(input.idOrientacion !== undefined ? { IdOrientacion: input.idOrientacion ? BigInt(input.idOrientacion) : null } : {}),
        ...(input.idProvincia !== undefined ? { IdProvincia: input.idProvincia ? BigInt(input.idProvincia) : null } : {}),
        ...(input.idMunicipio !== undefined ? { IdMunicipio: input.idMunicipio ? BigInt(input.idMunicipio) : null } : {}),
        ...(input.idSectorBarrio !== undefined ? { IdSectorBarrio: input.idSectorBarrio ? BigInt(input.idSectorBarrio) : null } : {}),
        ...(input.circunscripcion !== undefined ? { Circunscripcion: input.circunscripcion ?? null } : {}),
        ...(input.latitud !== undefined ? { Latitud: input.latitud !== null ? Number(input.latitud) : null } : {}),
        ...(input.longitud !== undefined ? { Longitud: input.longitud !== null ? Number(input.longitud) : null } : {}),
        ...(input.comentarioAnulado !== undefined ? { ComentarioAnulado: input.comentarioAnulado ?? null } : {}),
        ActualizadoPor: input.idUsuarioModifica ?? undefined,
      },
      select: {
        IdElemento: true,
        IdProveedor: true,
        Licencia: true,
        FechaEmision: true,
        FechaVencimiento: true,
        IdSeguimiento: true,
        IdTipoElemento: true,
        IdFormato: true,
        IdTamano: true,
        Activo: true,
        CostoAlquiler: true,
        Direccion: true,
        IdOrientacion: true,
        IdProvincia: true,
        IdMunicipio: true,
        IdSectorBarrio: true,
        Circunscripcion: true,
        Latitud: true,
        Longitud: true,
        Anulado: true,
        AnuladoPor: true,
        ComentarioAnulado: true,
        FechaAnulacion: true,
        FechaCreacion: true,
        FechaActualizacion: true,
        CreadoPor: true,
        ActualizadoPor: true,
      },
    });

    return mapRow(row);
  }

  async softDelete(idElemento: number, idUsuarioAnula: number): Promise<ElementoRecord> {
    const row = await this.prisma.elementos.update({
      where: { IdElemento: BigInt(idElemento) },
      data: {
        Anulado: true,
        AnuladoPor: BigInt(idUsuarioAnula),
        FechaAnulacion: new Date(),
      },
      select: {
        IdElemento: true,
        IdProveedor: true,
        Licencia: true,
        FechaEmision: true,
        FechaVencimiento: true,
        IdSeguimiento: true,
        IdTipoElemento: true,
        IdFormato: true,
        IdTamano: true,
        Activo: true,
        CostoAlquiler: true,
        Direccion: true,
        IdOrientacion: true,
        IdProvincia: true,
        IdMunicipio: true,
        IdSectorBarrio: true,
        Circunscripcion: true,
        Latitud: true,
        Longitud: true,
        Anulado: true,
        AnuladoPor: true,
        ComentarioAnulado: true,
        FechaAnulacion: true,
        FechaCreacion: true,
        FechaActualizacion: true,
        CreadoPor: true,
        ActualizadoPor: true,
      },
    });

    return mapRow(row);
  }

  async findTiposElementosCatalogo(): Promise<CatalogoSimpleRecord[]> {
    const rows = await this.prisma.tiposElementos.findMany({
      orderBy: { TipoElemento: 'asc' },
    });

    return rows.map((row) => mapCatalogoSimpleRow(row, 'IdTipoElemento', 'TipoElemento'));
  }

  async createTipoElementoCatalogo(input: CatalogoSimpleInput): Promise<CatalogoSimpleRecord> {
    const row = await this.prisma.tiposElementos.create({
      data: {
        TipoElemento: input.nombre,
        Activo: true,
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
    });

    return mapCatalogoSimpleRow(row, 'IdTipoElemento', 'TipoElemento');
  }

  async updateTipoElementoCatalogo(
    idTipoElemento: number,
    input: CatalogoSimpleUpdateInput,
  ): Promise<CatalogoSimpleRecord> {
    const row = await this.prisma.tiposElementos.update({
      where: { IdTipoElemento: BigInt(idTipoElemento) },
      data: {
        ...(input.nombre !== undefined ? { TipoElemento: input.nombre } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
    });

    return mapCatalogoSimpleRow(row, 'IdTipoElemento', 'TipoElemento');
  }

  async deactivateTipoElementoCatalogo(
    idTipoElemento: number,
    actualizadoPor: number,
  ): Promise<void> {
    await this.prisma.tiposElementos.update({
      where: { IdTipoElemento: BigInt(idTipoElemento) },
      data: {
        Activo: false,
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }

  async findOrientacionesCatalogo(): Promise<CatalogoSimpleRecord[]> {
    const rows = await this.prisma.orientaciones.findMany({
      orderBy: { Orientacion: 'asc' },
    });

    return rows.map((row) => mapCatalogoSimpleRow(row, 'IdOrientacion', 'Orientacion'));
  }

  async createOrientacionCatalogo(input: CatalogoSimpleInput): Promise<CatalogoSimpleRecord> {
    const row = await this.prisma.orientaciones.create({
      data: {
        Orientacion: input.nombre,
        Activo: true,
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
    });

    return mapCatalogoSimpleRow(row, 'IdOrientacion', 'Orientacion');
  }

  async updateOrientacionCatalogo(
    idOrientacion: number,
    input: CatalogoSimpleUpdateInput,
  ): Promise<CatalogoSimpleRecord> {
    const row = await this.prisma.orientaciones.update({
      where: { IdOrientacion: BigInt(idOrientacion) },
      data: {
        ...(input.nombre !== undefined ? { Orientacion: input.nombre } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
    });

    return mapCatalogoSimpleRow(row, 'IdOrientacion', 'Orientacion');
  }

  async deactivateOrientacionCatalogo(
    idOrientacion: number,
    actualizadoPor: number,
  ): Promise<void> {
    await this.prisma.orientaciones.update({
      where: { IdOrientacion: BigInt(idOrientacion) },
      data: {
        Activo: false,
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }

  async findDimensionesCatalogo(): Promise<CatalogoSimpleRecord[]> {
    const rows = await this.prisma.tamanos.findMany({
      orderBy: { Tamano: 'asc' },
    });

    return rows.map((row) => mapCatalogoSimpleRow(row, 'IdTamano', 'Tamano'));
  }

  async createDimensionCatalogo(input: CatalogoSimpleInput): Promise<CatalogoSimpleRecord> {
    const row = await this.prisma.tamanos.create({
      data: {
        Tamano: input.nombre,
        Activo: true,
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
    });

    return mapCatalogoSimpleRow(row, 'IdTamano', 'Tamano');
  }

  async updateDimensionCatalogo(
    idTamano: number,
    input: CatalogoSimpleUpdateInput,
  ): Promise<CatalogoSimpleRecord> {
    const row = await this.prisma.tamanos.update({
      where: { IdTamano: BigInt(idTamano) },
      data: {
        ...(input.nombre !== undefined ? { Tamano: input.nombre } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
    });

    return mapCatalogoSimpleRow(row, 'IdTamano', 'Tamano');
  }

  async deactivateDimensionCatalogo(idTamano: number, actualizadoPor: number): Promise<void> {
    await this.prisma.tamanos.update({
      where: { IdTamano: BigInt(idTamano) },
      data: {
        Activo: false,
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }

  async findFormatosCatalogo(): Promise<FormatoCatalogoRecord[]> {
    const rows = await this.prisma.formatos.findMany({
      include: { TiposElementos: { select: { TipoElemento: true } } },
      orderBy: [{ TiposElementos: { TipoElemento: 'asc' } }, { Formato: 'asc' }],
    });

    return rows.map(mapFormatoCatalogoRow);
  }

  async createFormatoCatalogo(input: FormatoCatalogoInput): Promise<FormatoCatalogoRecord> {
    const row = await this.prisma.formatos.create({
      data: {
        IdTipoElemento: BigInt(input.idTipoElemento),
        Formato: input.formato,
        Activo: true,
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
      include: { TiposElementos: { select: { TipoElemento: true } } },
    });

    return mapFormatoCatalogoRow(row);
  }

  async updateFormatoCatalogo(
    idFormato: number,
    input: FormatoCatalogoUpdateInput,
  ): Promise<FormatoCatalogoRecord> {
    const row = await this.prisma.formatos.update({
      where: { IdFormato: BigInt(idFormato) },
      data: {
        ...(input.idTipoElemento !== undefined
          ? { IdTipoElemento: BigInt(input.idTipoElemento) }
          : {}),
        ...(input.formato !== undefined ? { Formato: input.formato } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
      include: { TiposElementos: { select: { TipoElemento: true } } },
    });

    return mapFormatoCatalogoRow(row);
  }

  async deactivateFormatoCatalogo(idFormato: number, actualizadoPor: number): Promise<void> {
    await this.prisma.formatos.update({
      where: { IdFormato: BigInt(idFormato) },
      data: {
        Activo: false,
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }
}
