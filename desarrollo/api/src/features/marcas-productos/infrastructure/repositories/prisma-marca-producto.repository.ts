import { PrismaClient } from '@prisma/client';
import { MarcaProducto } from '../../domain/entities/marca-producto';
import {
  CreateMarcaProductoInput,
  MarcaProductoRepository,
  UpdateMarcaProductoInput,
} from '../../domain/repositories/marca-producto-repository';

function mapRow(row: {
  IdMarcaProducto: bigint;
  IdAnunciante: bigint;
  IdCategoriaAnunciante: bigint;
  MarcaProducto: string;
  Activo: boolean;
  FechaCreacion: Date;
  FechaActualizacion: Date;
  CreadoPor: bigint | null;
  ActualizadoPor: bigint | null;
  Anunciantes: { Anunciante: string };
  CategoriasAnunciantes: { CategoriaAnunciante: string };
}) {
  return new MarcaProducto({
    idMarcaProducto: Number(row.IdMarcaProducto),
    idAnunciante: Number(row.IdAnunciante),
    anunciante: row.Anunciantes.Anunciante,
    idCategoriaAnunciante: Number(row.IdCategoriaAnunciante),
    categoriaAnunciante: row.CategoriasAnunciantes.CategoriaAnunciante,
    marcaProducto: row.MarcaProducto,
    activo: row.Activo,
    fechaCreacion: row.FechaCreacion,
    fechaActualizacion: row.FechaActualizacion,
    creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
    actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
  });
}

export class PrismaMarcaProductoRepository implements MarcaProductoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<MarcaProducto[]> {
    const rows = await this.prisma.marcasProductos.findMany({
      include: {
        Anunciantes: { select: { Anunciante: true } },
        CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
      },
      orderBy: [
        { Anunciantes: { Anunciante: 'asc' } },
        { CategoriasAnunciantes: { CategoriaAnunciante: 'asc' } },
        { MarcaProducto: 'asc' },
      ],
    });

    return rows.map(mapRow);
  }

  async findById(idMarcaProducto: number): Promise<MarcaProducto | null> {
    const row = await this.prisma.marcasProductos.findUnique({
      where: { IdMarcaProducto: BigInt(idMarcaProducto) },
      include: {
        Anunciantes: { select: { Anunciante: true } },
        CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
      },
    });

    return row ? mapRow(row) : null;
  }

  async findByNombreInAnunciante(idAnunciante: number, marcaProducto: string): Promise<MarcaProducto | null> {
    const row = await this.prisma.marcasProductos.findFirst({
      where: {
        IdAnunciante: BigInt(idAnunciante),
        MarcaProducto: marcaProducto,
      },
      include: {
        Anunciantes: { select: { Anunciante: true } },
        CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
      },
    });

    return row ? mapRow(row) : null;
  }

  async findAnuncianteById(idAnunciante: number) {
    const row = await this.prisma.anunciantes.findUnique({
      where: { IdAnunciante: BigInt(idAnunciante) },
      select: {
        IdAnunciante: true,
        IdCategoriaAnunciante: true,
        Anunciante: true,
      },
    });

    if (!row) {
      return null;
    }

    return {
      idAnunciante: Number(row.IdAnunciante),
      idCategoriaAnunciante: Number(row.IdCategoriaAnunciante),
      anunciante: row.Anunciante,
    };
  }

  async findCategoriaById(idCategoriaAnunciante: number) {
    const row = await this.prisma.categoriasAnunciantes.findUnique({
      where: { IdCategoriaAnunciante: BigInt(idCategoriaAnunciante) },
      select: {
        IdCategoriaAnunciante: true,
        CategoriaAnunciante: true,
      },
    });

    if (!row) {
      return null;
    }

    return {
      idCategoriaAnunciante: Number(row.IdCategoriaAnunciante),
      categoriaAnunciante: row.CategoriaAnunciante,
    };
  }

  async create(input: CreateMarcaProductoInput): Promise<MarcaProducto> {
    const row = await this.prisma.marcasProductos.create({
      data: {
        IdAnunciante: BigInt(input.idAnunciante),
        IdCategoriaAnunciante: BigInt(input.idCategoriaAnunciante),
        MarcaProducto: input.marcaProducto,
        Activo: true,
        FechaCreacion: new Date(),
        FechaActualizacion: new Date(),
        CreadoPor: BigInt(input.creadoPor),
        ActualizadoPor: BigInt(input.creadoPor),
      },
      include: {
        Anunciantes: { select: { Anunciante: true } },
        CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
      },
    });

    return mapRow(row);
  }

  async update(idMarcaProducto: number, input: UpdateMarcaProductoInput): Promise<MarcaProducto> {
    const row = await this.prisma.marcasProductos.update({
      where: { IdMarcaProducto: BigInt(idMarcaProducto) },
      data: {
        ...(input.idAnunciante !== undefined ? { IdAnunciante: BigInt(input.idAnunciante) } : {}),
        ...(input.idCategoriaAnunciante !== undefined
          ? { IdCategoriaAnunciante: BigInt(input.idCategoriaAnunciante) }
          : {}),
        ...(input.marcaProducto !== undefined ? { MarcaProducto: input.marcaProducto } : {}),
        ...(input.activo !== undefined ? { Activo: input.activo } : {}),
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(input.actualizadoPor),
      },
      include: {
        Anunciantes: { select: { Anunciante: true } },
        CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
      },
    });

    return mapRow(row);
  }

  async deactivate(idMarcaProducto: number, actualizadoPor: number): Promise<void> {
    await this.prisma.marcasProductos.update({
      where: { IdMarcaProducto: BigInt(idMarcaProducto) },
      data: {
        Activo: false,
        FechaActualizacion: new Date(),
        ActualizadoPor: BigInt(actualizadoPor),
      },
    });
  }
}