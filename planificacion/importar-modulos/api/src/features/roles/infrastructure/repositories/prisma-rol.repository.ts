import { PrismaClient } from '@prisma/client';
import { SUPER_ADMIN_ROL_NAME } from '../../domain/constants/roles.constants';
import { RolDetail } from '../../domain/entities/rol-detail';
import { RolListItem } from '../../domain/entities/rol-list-item';
import {
  CreateRolInput,
  FindRolesFilters,
  RolRepository,
  UpdateRolInput,
} from '../../domain/repositories/rol-repository';

export class PrismaRolRepository implements RolRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(filters: FindRolesFilters): Promise<RolListItem[]> {
    const rows = await this.prisma.rol.findMany({
      where: {
        idNegocio: filters.idNegocio,
        ...(filters.includeAnulados ? {} : { anulado: false }),
        ...(filters.excludeSuperAdmin
          ? {
              NOT: {
                rol: { equals: SUPER_ADMIN_ROL_NAME, mode: 'insensitive' },
              },
            }
          : {}),
      },
      orderBy: { rol: 'asc' },
      select: {
        idRol: true,
        idNegocio: true,
        rol: true,
        descripcion: true,
        anulado: true,
        _count: {
          select: {
            rolModulos: { where: { modulo: { oculto: false } } },
          },
        },
      },
    });

    return rows.map(
      (row) =>
        new RolListItem({
          idRol: row.idRol,
          idNegocio: row.idNegocio,
          rol: row.rol,
          descripcion: row.descripcion,
          anulado: row.anulado,
          modulosCount: row._count.rolModulos,
        }),
    );
  }

  async findById(idRol: number, idNegocio: number): Promise<RolDetail | null> {
    const row = await this.prisma.rol.findFirst({
      where: { idRol, idNegocio },
      select: {
        idRol: true,
        idNegocio: true,
        rol: true,
        descripcion: true,
        anulado: true,
        comentario: true,
        rolModulos: {
          select: { idModulo: true },
        },
      },
    });

    if (!row) {
      return null;
    }

    return new RolDetail({
      idRol: row.idRol,
      idNegocio: row.idNegocio,
      rol: row.rol,
      descripcion: row.descripcion,
      anulado: row.anulado,
      comentario: row.comentario,
      idModulos: row.rolModulos.map((item) => item.idModulo),
    });
  }

  async findByNombre(rol: string, idNegocio: number): Promise<RolDetail | null> {
    const row = await this.prisma.rol.findFirst({
      where: { rol, idNegocio },
      select: { idRol: true },
    });

    if (!row) {
      return null;
    }

    return this.findById(row.idRol, idNegocio);
  }

  async create(input: CreateRolInput): Promise<RolDetail> {
    const row = await this.prisma.rol.create({
      data: {
        idNegocio: input.idNegocio,
        rol: input.rol,
        descripcion: input.descripcion,
        idUsuarioRegistra: input.idUsuarioRegistra,
        anulado: false,
        rolModulos: {
          create: input.idModulos.map((idModulo) => ({ idModulo })),
        },
      },
      select: { idRol: true },
    });

    const created = await this.findById(row.idRol, input.idNegocio);
    if (!created) {
      throw new Error('No se pudo leer el rol creado');
    }
    return created;
  }

  async update(
    idRol: number,
    idNegocio: number,
    input: UpdateRolInput,
  ): Promise<RolDetail> {
    await this.prisma.$transaction(async (tx) => {
      const updated = await tx.rol.updateMany({
        where: { idRol, idNegocio },
        data: {
          rol: input.rol,
          descripcion: input.descripcion,
          idUsuarioModifica: input.idUsuarioModifica,
          fechaModificacion: new Date(),
          comentario:
            input.comentario === undefined ? undefined : input.comentario,
        },
      });

      if (updated.count === 0) {
        throw new Error('Rol no encontrado');
      }

      if (input.idModulos !== undefined) {
        await tx.rolModulo.deleteMany({ where: { idRol } });
        if (input.idModulos.length > 0) {
          await tx.rolModulo.createMany({
            data: input.idModulos.map((idModulo) => ({ idRol, idModulo })),
          });
        }
      }
    });

    const updated = await this.findById(idRol, idNegocio);
    if (!updated) {
      throw new Error('No se pudo leer el rol actualizado');
    }
    return updated;
  }

  async softDelete(
    idRol: number,
    idNegocio: number,
    idUsuarioAnula: number,
  ): Promise<void> {
    const result = await this.prisma.rol.updateMany({
      where: { idRol, idNegocio },
      data: {
        anulado: true,
        idUsuarioAnula,
        fechaAnulado: new Date(),
      },
    });

    if (result.count === 0) {
      throw new Error('Rol no encontrado');
    }
  }

  async replaceModulos(
    idRol: number,
    idNegocio: number,
    idModulos: number[],
  ): Promise<void> {
    const existing = await this.prisma.rol.findFirst({
      where: { idRol, idNegocio },
      select: { idRol: true },
    });

    if (!existing) {
      throw new Error('Rol no encontrado');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.rolModulo.deleteMany({ where: { idRol } });
      if (idModulos.length > 0) {
        await tx.rolModulo.createMany({
          data: idModulos.map((idModulo) => ({ idRol, idModulo })),
        });
      }
    });
  }
}
