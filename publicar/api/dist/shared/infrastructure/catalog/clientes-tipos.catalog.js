"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClientesTiposCatalog = findClientesTiposCatalog;
async function findClientesTiposCatalog(prisma) {
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
//# sourceMappingURL=clientes-tipos.catalog.js.map