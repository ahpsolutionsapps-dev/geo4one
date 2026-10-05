import { PrismaClient } from '@prisma/client';

export interface ClienteTipoCatalogItem {
  idTipoCliente: number;
  nombre: string;
  descripcion: string | null;
  color: string | null;
  icono: string | null;
  orden: number;
}

type PrismaClientLike = PrismaClient & {
  clientesTipos: {
    findMany: (args: any) => Promise<any[]>;
  };
};

export async function findClientesTiposCatalog(
  prisma: PrismaClientLike,
): Promise<ClienteTipoCatalogItem[]> {
  const rows = await prisma.clientesTipos.findMany({
    where: {
      Anulado: false,
      Activo: true,
    },
    select: {
      IdTipoCliente: true,
      Nombre: true,
      Descripcion: true,
      Color: true,
      Icono: true,
      Orden: true,
    },
    orderBy: [{ Orden: 'asc' }, { Nombre: 'asc' }],
  });

  return rows.map((row) => ({
    idTipoCliente: row.IdTipoCliente,
    nombre: row.Nombre,
    descripcion: row.Descripcion ?? null,
    color: row.Color ?? null,
    icono: row.Icono ?? null,
    orden: row.Orden,
  }));
}
