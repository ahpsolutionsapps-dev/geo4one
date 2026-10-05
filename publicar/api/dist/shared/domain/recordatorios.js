"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIPO_ENTIDAD_CUENTA_PAGAR = void 0;
exports.getRecordatorioByEntidad = getRecordatorioByEntidad;
exports.getRecordatoriosByEntidades = getRecordatoriosByEntidades;
exports.syncRecordatorioEntidad = syncRecordatorioEntidad;
exports.TIPO_ENTIDAD_CUENTA_PAGAR = 'CuentaPagar';
async function getRecordatorioByEntidad(prisma, tipoEntidad, idEntidad) {
    const row = await prisma.recordatorios.findFirst({
        where: { TipoEntidad: tipoEntidad, IdEntidad: idEntidad },
        orderBy: { IdRecordatorio: 'desc' },
    });
    if (!row || !row.Activo) {
        return { activo: false, diasAnticipacion: null };
    }
    return {
        activo: true,
        diasAnticipacion: row.DiasAnticipacion,
    };
}
async function getRecordatoriosByEntidades(prisma, tipoEntidad, idsEntidad) {
    const map = new Map();
    if (idsEntidad.length === 0) {
        return map;
    }
    const rows = await prisma.recordatorios.findMany({
        where: {
            TipoEntidad: tipoEntidad,
            IdEntidad: { in: idsEntidad },
        },
        orderBy: { IdRecordatorio: 'desc' },
    });
    for (const row of rows) {
        if (map.has(row.IdEntidad)) {
            continue;
        }
        map.set(row.IdEntidad, {
            activo: row.Activo,
            diasAnticipacion: row.Activo ? row.DiasAnticipacion : null,
        });
    }
    return map;
}
async function syncRecordatorioEntidad(prisma, tipoEntidad, idEntidad, activo, diasAnticipacion, idUsuarioRegistra) {
    const existing = await prisma.recordatorios.findFirst({
        where: { TipoEntidad: tipoEntidad, IdEntidad: idEntidad },
        orderBy: { IdRecordatorio: 'desc' },
    });
    if (!activo) {
        if (existing?.Activo) {
            await prisma.recordatorios.update({
                where: { IdRecordatorio: existing.IdRecordatorio },
                data: {
                    Activo: false,
                    ...(idUsuarioRegistra != null
                        ? { IdUsuarioModifica: idUsuarioRegistra, FechaModificacion: new Date() }
                        : {}),
                },
            });
        }
        return;
    }
    const dias = diasAnticipacion ?? existing?.DiasAnticipacion ?? 5;
    if (existing) {
        await prisma.recordatorios.update({
            where: { IdRecordatorio: existing.IdRecordatorio },
            data: {
                DiasAnticipacion: dias,
                Activo: true,
                ...(idUsuarioRegistra != null
                    ? { IdUsuarioModifica: idUsuarioRegistra, FechaModificacion: new Date() }
                    : {}),
            },
        });
        return;
    }
    if (idUsuarioRegistra == null) {
        throw new Error('IdUsuarioRegistra es requerido para crear un recordatorio');
    }
    await prisma.recordatorios.create({
        data: {
            TipoEntidad: tipoEntidad,
            IdEntidad: idEntidad,
            Titulo: `Recordatorio ${tipoEntidad} #${idEntidad}`,
            DiasAnticipacion: dias,
            Activo: true,
            IdUsuarioRegistra: idUsuarioRegistra,
        },
    });
}
//# sourceMappingURL=recordatorios.js.map