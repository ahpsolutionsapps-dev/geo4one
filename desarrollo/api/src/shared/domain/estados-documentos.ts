import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../core/errors/app-error';

export const MODULO_CUENTA_PAGAR = 'CuentaPagar';

type EstadoDocumentoDefault = {
  nombre: string;
  color: string;
  esFinal: boolean;
  orden: number;
};

const DEFAULT_ESTADOS_POR_MODULO: Record<string, EstadoDocumentoDefault[]> = {
  [MODULO_CUENTA_PAGAR]: [
    { nombre: 'Pendiente', color: '#FFC107', esFinal: false, orden: 1 },
    { nombre: 'Parcial', color: '#2196F3', esFinal: false, orden: 2 },
    { nombre: 'Pagada', color: '#4CAF50', esFinal: true, orden: 3 },
    { nombre: 'Vencida', color: '#F44336', esFinal: false, orden: 4 },
    { nombre: 'Anulada', color: '#9E9E9E', esFinal: true, orden: 5 },
  ],
};

export type EstadoDocumentoInfo = {
  idEstadoDocumento: number;
  nombre: string;
  color: string | null;
  esFinal: boolean;
  orden: number;
};

function toEstadoInfo(row: {
  IdEstadoDocumento: number;
  Nombre: string;
  Color: string | null;
  EsFinal: boolean;
  Orden: number;
}): EstadoDocumentoInfo {
  return {
    idEstadoDocumento: row.IdEstadoDocumento,
    nombre: row.Nombre,
    color: row.Color,
    esFinal: row.EsFinal,
    orden: row.Orden,
  };
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

async function findEstadoByNombre(
  prisma: Pick<PrismaClient, 'estadosDocumentos'>,
  modulo: string,
  nombre: string,
) {
  const target = normalizeLabel(nombre);
  const rows = await prisma.estadosDocumentos.findMany({
    where: { Modulo: modulo },
  });

  return (
    rows.find(
      (row) => !row.Anulado && normalizeLabel(row.Nombre) === target,
    ) ??
    rows.find((row) => normalizeLabel(row.Nombre) === target) ??
    null
  );
}

async function ensureDefaultEstadosDocumentos(
  prisma: Pick<PrismaClient, 'estadosDocumentos'>,
  modulo: string,
): Promise<void> {
  const defaults = DEFAULT_ESTADOS_POR_MODULO[modulo];
  if (!defaults) {
    return;
  }

  try {
    await prisma.estadosDocumentos.createMany({
      data: defaults.map((estado) => ({
        Modulo: modulo,
        Nombre: estado.nombre,
        Color: estado.color,
        EsFinal: estado.esFinal,
        Orden: estado.orden,
        IdUsuarioRegistra: 1,
      })),
      skipDuplicates: true,
    });
  } catch {
    // Si el catálogo no puede sembrarse (por ejemplo, falta el usuario 1),
    // la búsqueda posterior devolverá el error original.
  }
}

export async function getEstadoDocumentoByNombre(
  prisma: Pick<PrismaClient, 'estadosDocumentos'>,
  modulo: string,
  nombre: string,
): Promise<EstadoDocumentoInfo> {
  let row = await findEstadoByNombre(prisma, modulo, nombre);

  if (!row) {
    await ensureDefaultEstadosDocumentos(prisma, modulo);
    row = await findEstadoByNombre(prisma, modulo, nombre);
  }

  if (!row) {
    throw new NotFoundError(
      `Estado de documento "${nombre}" no encontrado para el modulo ${modulo}`,
    );
  }

  return toEstadoInfo(row);
}

export async function getEstadoDocumentoById(
  prisma: Pick<PrismaClient, 'estadosDocumentos'>,
  idEstadoDocumento: number,
  modulo?: string,
): Promise<EstadoDocumentoInfo> {
  const row = await prisma.estadosDocumentos.findFirst({
    where: {
      IdEstadoDocumento: idEstadoDocumento,
      ...(modulo ? { Modulo: modulo } : {}),
    },
  });

  if (!row) {
    throw new NotFoundError('Estado de documento no encontrado');
  }

  return toEstadoInfo(row);
}

export async function listEstadosDocumentosByModulo(
  prisma: Pick<PrismaClient, 'estadosDocumentos'>,
  modulo: string,
): Promise<EstadoDocumentoInfo[]> {
  let rows = await prisma.estadosDocumentos.findMany({
    where: { Modulo: modulo, Anulado: false },
    orderBy: [{ Orden: 'asc' }, { Nombre: 'asc' }],
  });

  if (rows.length === 0) {
    await ensureDefaultEstadosDocumentos(prisma, modulo);
    rows = await prisma.estadosDocumentos.findMany({
      where: { Modulo: modulo, Anulado: false },
      orderBy: [{ Orden: 'asc' }, { Nombre: 'asc' }],
    });
  }

  return rows.map(toEstadoInfo);
}
