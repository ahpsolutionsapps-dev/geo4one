import { PrismaClient } from '@prisma/client';
import { Proveedor } from '../../domain/entities/proveedor';
import {
  CreateProveedorInput,
  CreateProveedorTelefonoInput,
  ProveedorRepository,
  ProveedorTelefono,
  UpdateProveedorInput,
  UpdateProveedorTelefonoInput,
} from '../../domain/repositories/proveedor-repository';

function mapRow(row: {
  IdProveedor: bigint;
  Proveedor: string;
  RNC: string | null;
  PersonaContacto: string | null;
  Cargo: string | null;
  Email: string | null;
  PaginaWeb: string | null;
  Direccion: string | null;
  IdProvincia: bigint | null;
  IdMunicipio: bigint | null;
  IdSectorBarrio: bigint | null;
  Activo: boolean;
  FechaCreacion: Date;
  FechaActualizacion: Date;
  CreadoPor: bigint | null;
  ActualizadoPor: bigint | null;
  Provincias: { Provincia: string } | null;
  Municipios: { Municipio: string } | null;
  SectoresBarrios: { SectorBarrio: string } | null;
}) {
  return new Proveedor({
    idProveedor: Number(row.IdProveedor),
    proveedor: row.Proveedor,
    rnc: row.RNC,
    personaContacto: row.PersonaContacto,
    cargo: row.Cargo,
    email: row.Email,
    paginaWeb: row.PaginaWeb,
    direccion: row.Direccion,
    idProvincia: row.IdProvincia === null ? null : Number(row.IdProvincia),
    idMunicipio: row.IdMunicipio === null ? null : Number(row.IdMunicipio),
    idSectorBarrio: row.IdSectorBarrio === null ? null : Number(row.IdSectorBarrio),
    provinciaNombre: row.Provincias?.Provincia ?? null,
    municipioNombre: row.Municipios?.Municipio ?? null,
    sectorBarrioNombre: row.SectoresBarrios?.SectorBarrio ?? null,
    activo: row.Activo,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  });
}

export class PrismaProveedorRepository implements ProveedorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<Proveedor[]> {
    const rows = await this.prisma.proveedores.findMany({
      include: {
        Provincias: { select: { Provincia: true } },
        Municipios: { select: { Municipio: true } },
        SectoresBarrios: { select: { SectorBarrio: true } },
      },
      orderBy: [{ Proveedor: 'asc' }],
    });

    return rows.map(mapRow);
  }

  async findById(idProveedor: number): Promise<Proveedor | null> {
    const row = await this.prisma.proveedores.findUnique({
      where: { IdProveedor: BigInt(idProveedor) },
      include: {
        Provincias: { select: { Provincia: true } },
        Municipios: { select: { Municipio: true } },
        SectoresBarrios: { select: { SectorBarrio: true } },
      },
    });

    return row ? mapRow(row) : null;
  }

  async findByRnc(rnc: string): Promise<Proveedor | null> {
    const row = await this.prisma.proveedores.findFirst({
      where: { RNC: rnc },
      include: {
        Provincias: { select: { Provincia: true } },
        Municipios: { select: { Municipio: true } },
        SectoresBarrios: { select: { SectorBarrio: true } },
      },
    });

    return row ? mapRow(row) : null;
  }

  async create(input: CreateProveedorInput): Promise<Proveedor> {
    const row = await this.prisma.proveedores.create({
      data: {
        Proveedor: input.proveedor,
        RNC: input.rnc ?? null,
        PersonaContacto: input.personaContacto ?? null,
        Cargo: input.cargo ?? null,
        Email: input.email ?? null,
        PaginaWeb: input.paginaWeb ?? null,
        Direccion: input.direccion ?? null,
        IdProvincia: input.idProvincia ? BigInt(input.idProvincia) : null,
        IdMunicipio: input.idMunicipio ? BigInt(input.idMunicipio) : null,
        IdSectorBarrio: input.idSectorBarrio ? BigInt(input.idSectorBarrio) : null,
        Activo: true,
        FechaCreacion: new Date(),
        FechaActualizacion: new Date(),
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
      include: {
        Provincias: { select: { Provincia: true } },
        Municipios: { select: { Municipio: true } },
        SectoresBarrios: { select: { SectorBarrio: true } },
      },
    });

    return mapRow(row);
  }

  async update(idProveedor: number, input: UpdateProveedorInput): Promise<Proveedor> {
    const row = await this.prisma.proveedores.update({
      where: { IdProveedor: BigInt(idProveedor) },
      data: {
        ...(input.proveedor !== undefined ? { Proveedor: input.proveedor } : {}),
        ...(input.rnc !== undefined ? { RNC: input.rnc } : {}),
        ...(input.personaContacto !== undefined
          ? { PersonaContacto: input.personaContacto }
          : {}),
        ...(input.cargo !== undefined ? { Cargo: input.cargo } : {}),
        ...(input.email !== undefined ? { Email: input.email } : {}),
        ...(input.paginaWeb !== undefined ? { PaginaWeb: input.paginaWeb } : {}),
        ...(input.direccion !== undefined ? { Direccion: input.direccion } : {}),
        ...(input.idProvincia !== undefined
          ? { IdProvincia: input.idProvincia ? BigInt(input.idProvincia) : null }
          : {}),
        ...(input.idMunicipio !== undefined
          ? { IdMunicipio: input.idMunicipio ? BigInt(input.idMunicipio) : null }
          : {}),
        ...(input.idSectorBarrio !== undefined
          ? { IdSectorBarrio: input.idSectorBarrio ? BigInt(input.idSectorBarrio) : null }
          : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
      include: {
        Provincias: { select: { Provincia: true } },
        Municipios: { select: { Municipio: true } },
        SectoresBarrios: { select: { SectorBarrio: true } },
      },
    });

    return mapRow(row);
  }

  async deactivate(idProveedor: number, actualizadoPor: number): Promise<void> {
    await this.prisma.proveedores.update({
      where: { IdProveedor: BigInt(idProveedor) },
      data: {
        Activo: false,
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }

  async findTelefonos(idProveedor: number): Promise<ProveedorTelefono[]> {
    const rows = await this.prisma.proveedoresTelefonos.findMany({
      where: { IdProveedor: BigInt(idProveedor), Activo: true },
      orderBy: [{ Principal: 'desc' }, { FechaCreacion: 'asc' }],
    });

    return rows.map((row) => ({
      idProveedorTelefono: Number(row.IdProveedorTelefono),
      idProveedor: Number(row.IdProveedor),
      telefono: row.Telefono,
      tipo: row.Tipo,
      principal: row.Principal,
      activo: row.Activo,
      fechaCreacion: row.FechaCreacion,
      fechaActualizacion: row.FechaActualizacion,
      creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
      actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    }));
  }

  async findTelefonoById(idProveedorTelefono: number): Promise<ProveedorTelefono | null> {
    const row = await this.prisma.proveedoresTelefonos.findUnique({
      where: { IdProveedorTelefono: BigInt(idProveedorTelefono) },
    });

    if (!row) {
      return null;
    }

    return {
      idProveedorTelefono: Number(row.IdProveedorTelefono),
      idProveedor: Number(row.IdProveedor),
      telefono: row.Telefono,
      tipo: row.Tipo,
      principal: row.Principal,
      activo: row.Activo,
      fechaCreacion: row.FechaCreacion,
      fechaActualizacion: row.FechaActualizacion,
      creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
      actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    };
  }

  async createTelefono(input: CreateProveedorTelefonoInput): Promise<ProveedorTelefono> {
    return this.prisma.$transaction(async (tx) => {
      if (input.principal && !input.tipo) {
        throw new Error('El tipo es obligatorio cuando el teléfono es principal');
      }

      if (input.principal) {
        await tx.proveedoresTelefonos.updateMany({
          where: { IdProveedor: BigInt(input.idProveedor), Principal: true },
          data: {
            Principal: false,
            ActualizadoPor: BigInt(input.creadoPor),
            FechaActualizacion: new Date(),
          },
        });
      }

      const row = await tx.proveedoresTelefonos.create({
        data: {
          IdProveedor: BigInt(input.idProveedor),
          Telefono: input.telefono,
          Tipo: input.tipo ?? null,
          Principal: input.principal ?? false,
          Activo: true,
          CreadoPor: BigInt(input.creadoPor),
          ActualizadoPor: BigInt(input.creadoPor),
          FechaCreacion: new Date(),
          FechaActualizacion: new Date(),
        },
      });

      return {
        idProveedorTelefono: Number(row.IdProveedorTelefono),
        idProveedor: Number(row.IdProveedor),
        telefono: row.Telefono,
        tipo: row.Tipo,
        principal: row.Principal,
        activo: row.Activo,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
      };
    });
  }

  async updateTelefono(
    idProveedorTelefono: number,
    input: UpdateProveedorTelefonoInput,
  ): Promise<ProveedorTelefono> {
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.proveedoresTelefonos.findUnique({
        where: { IdProveedorTelefono: BigInt(idProveedorTelefono) },
      });

      if (!current) {
        throw new Error('Telefono no encontrado');
      }

      const nextPrincipal = input.principal ?? current.Principal;
      const nextTipo = input.tipo !== undefined ? input.tipo : current.Tipo;

      if (nextPrincipal && !nextTipo) {
        throw new Error('El tipo es obligatorio cuando el teléfono es principal');
      }

      if (nextPrincipal) {
        await tx.proveedoresTelefonos.updateMany({
          where: {
            IdProveedor: current.IdProveedor,
            Principal: true,
            NOT: { IdProveedorTelefono: BigInt(idProveedorTelefono) },
          },
          data: {
            Principal: false,
            ActualizadoPor: BigInt(input.actualizadoPor),
            FechaActualizacion: new Date(),
          },
        });
      }

      const row = await tx.proveedoresTelefonos.update({
        where: { IdProveedorTelefono: BigInt(idProveedorTelefono) },
        data: {
          ...(input.telefono !== undefined ? { Telefono: input.telefono } : {}),
          ...(input.tipo !== undefined ? { Tipo: input.tipo } : {}),
          ...(input.principal !== undefined ? { Principal: input.principal } : {}),
          ...(input.activo !== undefined ? { Activo: input.activo } : {}),
          ActualizadoPor: BigInt(input.actualizadoPor),
          FechaActualizacion: new Date(),
        },
      });

      return {
        idProveedorTelefono: Number(row.IdProveedorTelefono),
        idProveedor: Number(row.IdProveedor),
        telefono: row.Telefono,
        tipo: row.Tipo,
        principal: row.Principal,
        activo: row.Activo,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
      };
    });
  }

  async deactivateTelefono(idProveedorTelefono: number, actualizadoPor: number): Promise<void> {
    await this.prisma.proveedoresTelefonos.update({
      where: { IdProveedorTelefono: BigInt(idProveedorTelefono) },
      data: {
        Activo: false,
        ActualizadoPor: BigInt(actualizadoPor),
        FechaActualizacion: new Date(),
      },
    });
  }
}
