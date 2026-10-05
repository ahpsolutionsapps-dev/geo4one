"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULO_CUENTA_PAGAR = void 0;
exports.getEstadoDocumentoByNombre = getEstadoDocumentoByNombre;
exports.getEstadoDocumentoById = getEstadoDocumentoById;
exports.listEstadosDocumentosByModulo = listEstadosDocumentosByModulo;
const app_error_1 = require("../../core/errors/app-error");
exports.MODULO_CUENTA_PAGAR = 'CuentaPagar';
const DEFAULT_ESTADOS_POR_MODULO = {
    [exports.MODULO_CUENTA_PAGAR]: [
        { nombre: 'Pendiente', color: '#FFC107', esFinal: false, orden: 1 },
        { nombre: 'Parcial', color: '#2196F3', esFinal: false, orden: 2 },
        { nombre: 'Pagada', color: '#4CAF50', esFinal: true, orden: 3 },
        { nombre: 'Vencida', color: '#F44336', esFinal: false, orden: 4 },
        { nombre: 'Anulada', color: '#9E9E9E', esFinal: true, orden: 5 },
    ],
};
function toEstadoInfo(row) {
    return {
        idEstadoDocumento: row.IdEstadoDocumento,
        nombre: row.Nombre,
        color: row.Color,
        esFinal: row.EsFinal,
        orden: row.Orden,
    };
}
function normalizeLabel(value) {
    return value.trim().toLowerCase();
}
async function findEstadoByNombre(prisma, modulo, nombre) {
    const target = normalizeLabel(nombre);
    const rows = await prisma.estadosDocumentos?.findMany?.({
        where: { Modulo: modulo },
    });
    if (!rows) {
        return null;
    }
    return (rows.find((row) => !row.Anulado && normalizeLabel(row.Nombre) === target) ??
        rows.find((row) => normalizeLabel(row.Nombre) === target) ??
        null);
}
async function ensureDefaultEstadosDocumentos(prisma, modulo) {
    const defaults = DEFAULT_ESTADOS_POR_MODULO[modulo];
    if (!defaults || !prisma.estadosDocumentos?.createMany) {
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
    }
    catch {
        // Si el catálogo no puede sembrarse (por ejemplo, falta el usuario 1),
        // la búsqueda posterior devolverá el error original.
    }
}
async function getEstadoDocumentoByNombre(prisma, modulo, nombre) {
    let row = await findEstadoByNombre(prisma, modulo, nombre);
    if (!row) {
        await ensureDefaultEstadosDocumentos(prisma, modulo);
        row = await findEstadoByNombre(prisma, modulo, nombre);
    }
    if (!row) {
        throw new app_error_1.NotFoundError(`Estado de documento "${nombre}" no encontrado para el modulo ${modulo}`);
    }
    return toEstadoInfo(row);
}
async function getEstadoDocumentoById(prisma, idEstadoDocumento, modulo) {
    const row = await prisma.estadosDocumentos?.findFirst?.({
        where: {
            IdEstadoDocumento: idEstadoDocumento,
            ...(modulo ? { Modulo: modulo } : {}),
        },
    });
    if (!row) {
        throw new app_error_1.NotFoundError('Estado de documento no encontrado');
    }
    return toEstadoInfo(row);
}
async function listEstadosDocumentosByModulo(prisma, modulo) {
    let rows = await prisma.estadosDocumentos?.findMany?.({
        where: { Modulo: modulo, Anulado: false },
        orderBy: [{ Orden: 'asc' }, { Nombre: 'asc' }],
    });
    if (!rows || rows.length === 0) {
        await ensureDefaultEstadosDocumentos(prisma, modulo);
        rows = await prisma.estadosDocumentos?.findMany?.({
            where: { Modulo: modulo, Anulado: false },
            orderBy: [{ Orden: 'asc' }, { Nombre: 'asc' }],
        }) ?? [];
    }
    return (rows ?? []).map(toEstadoInfo);
}
//# sourceMappingURL=estados-documentos.js.map