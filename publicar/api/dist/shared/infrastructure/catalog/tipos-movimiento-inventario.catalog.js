"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIPO_AJUSTE_NOMBRE_NEG = exports.TIPO_AJUSTE_NOMBRE_POS = exports.TIPO_AJUSTE_CODIGO_NEG = exports.TIPO_AJUSTE_CODIGO_POS = exports.TIPOS_MOVIMIENTO_INVENTARIO_CATALOG = void 0;
exports.buildAjusteTipoWhere = buildAjusteTipoWhere;
exports.resolveTipoAjusteInventario = resolveTipoAjusteInventario;
exports.findTiposMovimientoCatalog = findTiposMovimientoCatalog;
exports.TIPOS_MOVIMIENTO_INVENTARIO_CATALOG = [
    {
        Codigo: 'COMPRA',
        Nombre: 'Entrada por compra',
        Naturaleza: 'E',
        Descripcion: 'Ingreso de productos por compra a proveedor',
        AfectaCosto: true,
        RequiereDocumento: true,
        Orden: 1,
    },
    {
        Codigo: 'VENTA',
        Nombre: 'Salida por venta',
        Naturaleza: 'S',
        Descripcion: 'Salida de productos vendidos al cliente',
        AfectaCosto: false,
        RequiereDocumento: true,
        Orden: 2,
    },
    {
        Codigo: 'AJUSTE_POS',
        Nombre: 'Ajuste positivo',
        Naturaleza: 'E',
        Descripcion: 'Incremento manual de inventario',
        AfectaCosto: true,
        RequiereDocumento: false,
        Orden: 3,
    },
    {
        Codigo: 'AJUSTE_NEG',
        Nombre: 'Ajuste negativo',
        Naturaleza: 'S',
        Descripcion: 'Disminución manual de inventario',
        AfectaCosto: true,
        RequiereDocumento: false,
        Orden: 4,
    },
    {
        Codigo: 'DEV_CLIENTE',
        Nombre: 'Devolución de cliente',
        Naturaleza: 'E',
        Descripcion: 'Producto devuelto por cliente',
        AfectaCosto: false,
        RequiereDocumento: true,
        Orden: 5,
    },
];
exports.TIPO_AJUSTE_CODIGO_POS = 'AJUSTE_POS';
exports.TIPO_AJUSTE_CODIGO_NEG = 'AJUSTE_NEG';
exports.TIPO_AJUSTE_NOMBRE_POS = 'Ajuste positivo';
exports.TIPO_AJUSTE_NOMBRE_NEG = 'Ajuste negativo';
const AJUSTE_NOMBRES_LEGACY = ['Ajuste de Entrada', 'Ajuste de Salida'];
const AJUSTE_NOMBRE_CANONICO = {
    'ajuste de entrada': exports.TIPO_AJUSTE_NOMBRE_POS,
    'ajuste positivo': exports.TIPO_AJUSTE_NOMBRE_POS,
    'ajuste de salida': exports.TIPO_AJUSTE_NOMBRE_NEG,
    'ajuste negativo': exports.TIPO_AJUSTE_NOMBRE_NEG,
};
function buildAjusteTipoWhere() {
    return {
        Anulado: false,
        OR: [
            { Codigo: { startsWith: 'AJUSTE_' } },
            {
                Nombre: {
                    in: [
                        exports.TIPO_AJUSTE_NOMBRE_POS,
                        exports.TIPO_AJUSTE_NOMBRE_NEG,
                        ...AJUSTE_NOMBRES_LEGACY,
                    ],
                },
            },
        ],
    };
}
const tipoAjusteSelect = {
    IdTipoMovimiento: true,
    Naturaleza: true,
};
async function resolveTipoAjusteInventario(tx, input) {
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
        const codigoNat = input.naturaleza === 'E' ? exports.TIPO_AJUSTE_CODIGO_POS : exports.TIPO_AJUSTE_CODIGO_NEG;
        const byCodigoNat = await tx.tiposMovimientoInventario.findFirst({
            where: { Codigo: codigoNat, Anulado: false },
            select: tipoAjusteSelect,
        });
        if (byCodigoNat) {
            return byCodigoNat;
        }
        const nombresNat = input.naturaleza === 'E'
            ? [exports.TIPO_AJUSTE_NOMBRE_POS, 'Ajuste de Entrada']
            : [exports.TIPO_AJUSTE_NOMBRE_NEG, 'Ajuste de Salida'];
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
async function findTiposMovimientoCatalog(prisma, filters) {
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
        naturaleza: row.Naturaleza,
        descripcion: row.Descripcion ?? null,
        afectaCosto: row.AfectaCosto,
        afectaInventario: row.AfectaInventario,
        requiereDocumento: row.RequiereDocumento,
        orden: row.Orden,
    }));
}
//# sourceMappingURL=tipos-movimiento-inventario.catalog.js.map