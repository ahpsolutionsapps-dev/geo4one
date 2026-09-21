import { Prisma, PrismaClient } from '@prisma/client';

export type NaturalezaMovimientoCatalogo = 'E' | 'S';

export interface TipoMovimientoInventarioCatalogItem {
  idTipoMovimiento: number;
  codigo: string;
  nombre: string;
  naturaleza: NaturalezaMovimientoCatalogo;
  descripcion: string | null;
  afectaCosto: boolean;
  afectaInventario: boolean;
  requiereDocumento: boolean;
  orden: number;
}

export const TIPOS_MOVIMIENTO_INVENTARIO_CATALOG = [
  {
    Codigo: 'COMPRA',
    Nombre: 'Entrada por compra',
    Naturaleza: 'E' as const,
    Descripcion: 'Ingreso de productos por compra a proveedor',
    AfectaCosto: true,
    RequiereDocumento: true,
    Orden: 1,
  },
  {
    Codigo: 'VENTA',
    Nombre: 'Salida por venta',
    Naturaleza: 'S' as const,
    Descripcion: 'Salida de productos vendidos al cliente',
    AfectaCosto: false,
    RequiereDocumento: true,
    Orden: 2,
  },
  {
    Codigo: 'AJUSTE_POS',
    Nombre: 'Ajuste positivo',
    Naturaleza: 'E' as const,
    Descripcion: 'Incremento manual de inventario',
    AfectaCosto: true,
    RequiereDocumento: false,
    Orden: 3,
  },
  {
    Codigo: 'AJUSTE_NEG',
    Nombre: 'Ajuste negativo',
    Naturaleza: 'S' as const,
    Descripcion: 'Disminución manual de inventario',
    AfectaCosto: true,
    RequiereDocumento: false,
    Orden: 4,
  },
  {
    Codigo: 'DEV_CLIENTE',
    Nombre: 'Devolución de cliente',
    Naturaleza: 'E' as const,
    Descripcion: 'Producto devuelto por cliente',
    AfectaCosto: false,
    RequiereDocumento: true,
    Orden: 5,
  },
] as const;

export const TIPO_AJUSTE_CODIGO_POS = 'AJUSTE_POS';
export const TIPO_AJUSTE_CODIGO_NEG = 'AJUSTE_NEG';
export const TIPO_AJUSTE_NOMBRE_POS = 'Ajuste positivo';
export const TIPO_AJUSTE_NOMBRE_NEG = 'Ajuste negativo';

const AJUSTE_NOMBRES_LEGACY = ['Ajuste de Entrada', 'Ajuste de Salida'] as const;

const AJUSTE_NOMBRE_CANONICO: Record<string, string> = {
  'ajuste de entrada': TIPO_AJUSTE_NOMBRE_POS,
  'ajuste positivo': TIPO_AJUSTE_NOMBRE_POS,
  'ajuste de salida': TIPO_AJUSTE_NOMBRE_NEG,
  'ajuste negativo': TIPO_AJUSTE_NOMBRE_NEG,
};

export function buildAjusteTipoWhere(): Prisma.TiposMovimientoInventarioWhereInput {
  return {
    Anulado: false,
    OR: [
      { Codigo: { startsWith: 'AJUSTE_' } },
      {
        Nombre: {
          in: [
            TIPO_AJUSTE_NOMBRE_POS,
            TIPO_AJUSTE_NOMBRE_NEG,
            ...AJUSTE_NOMBRES_LEGACY,
          ],
        },
      },
    ],
  };
}

type TiposMovimientoTx = {
  tiposMovimientoInventario: PrismaClient['tiposMovimientoInventario'];
};

const tipoAjusteSelect = {
  IdTipoMovimiento: true,
  Naturaleza: true,
} as const;

export type TipoAjusteResuelto = {
  IdTipoMovimiento: number;
  Naturaleza: string;
};

export async function resolveTipoAjusteInventario(
  tx: TiposMovimientoTx,
  input: {
    idTipoMovimiento?: number;
    naturaleza?: NaturalezaMovimientoCatalogo;
    tipoNombre?: string;
    codigo?: string;
  },
): Promise<TipoAjusteResuelto | null> {
  if (input.idTipoMovimiento != null) {
    const byId = await tx.tiposMovimientoInventario.findFirst({
      where: {
        IdTipoMovimiento: input.idTipoMovimiento,
        Visible: true,
        ...buildAjusteTipoWhere(),
      },
      select: tipoAjusteSelect,
    });
    if (byId) {
      return byId;
    }
  }

  const codigo = input.codigo?.trim().toUpperCase();
  if (codigo) {
    const byCodigo = await tx.tiposMovimientoInventario.findFirst({
      where: { Codigo: codigo, Anulado: false },
      select: tipoAjusteSelect,
    });
    if (byCodigo) {
      return byCodigo;
    }
  }

  const nombreRaw = input.tipoNombre?.trim();
  if (nombreRaw) {
    const canonical = AJUSTE_NOMBRE_CANONICO[nombreRaw.toLowerCase()] ?? nombreRaw;
    const nombres = Array.from(new Set([canonical, nombreRaw]));
    const byNombre = await tx.tiposMovimientoInventario.findFirst({
      where: { Nombre: { in: nombres }, Anulado: false },
      select: tipoAjusteSelect,
    });
    if (byNombre) {
      return byNombre;
    }
  }

  if (input.naturaleza === 'E' || input.naturaleza === 'S') {
    const codigoNat =
      input.naturaleza === 'E' ? TIPO_AJUSTE_CODIGO_POS : TIPO_AJUSTE_CODIGO_NEG;
    const byCodigoNat = await tx.tiposMovimientoInventario.findFirst({
      where: { Codigo: codigoNat, Anulado: false },
      select: tipoAjusteSelect,
    });
    if (byCodigoNat) {
      return byCodigoNat;
    }

    const nombresNat =
      input.naturaleza === 'E'
        ? [TIPO_AJUSTE_NOMBRE_POS, 'Ajuste de Entrada']
        : [TIPO_AJUSTE_NOMBRE_NEG, 'Ajuste de Salida'];
    const byNombreNat = await tx.tiposMovimientoInventario.findFirst({
      where: { Nombre: { in: nombresNat }, Anulado: false },
      select: tipoAjusteSelect,
    });
    if (byNombreNat) {
      return byNombreNat;
    }
  }

  return null;
}

type PrismaClientLike = Pick<PrismaClient, 'tiposMovimientoInventario'>;

export async function findTiposMovimientoCatalog(
  prisma: PrismaClientLike,
  filters?: {
    soloAjustes?: boolean;
    soloVisibles?: boolean;
  },
): Promise<TipoMovimientoInventarioCatalogItem[]> {
  const rows = await prisma.tiposMovimientoInventario.findMany({
    where: {
      Anulado: false,
      ...(filters?.soloVisibles === false ? {} : { Visible: true }),
      ...(filters?.soloAjustes ? buildAjusteTipoWhere() : {}),
    },
    select: {
      IdTipoMovimiento: true,
      Codigo: true,
      Nombre: true,
      Naturaleza: true,
      Descripcion: true,
      AfectaCosto: true,
      AfectaInventario: true,
      RequiereDocumento: true,
      Orden: true,
    },
    orderBy: [{ Orden: 'asc' }, { Nombre: 'asc' }],
  });

  return rows.map((row) => ({
    idTipoMovimiento: row.IdTipoMovimiento,
    codigo: row.Codigo,
    nombre: row.Nombre,
    naturaleza: row.Naturaleza as NaturalezaMovimientoCatalogo,
    descripcion: row.Descripcion ?? null,
    afectaCosto: row.AfectaCosto,
    afectaInventario: row.AfectaInventario,
    requiereDocumento: row.RequiereDocumento,
    orden: row.Orden,
  }));
}
