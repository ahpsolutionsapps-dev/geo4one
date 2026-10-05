"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaComboAnuncianteRepository = void 0;
const combo_anunciante_1 = require("../../domain/entities/combo-anunciante");
function mapRow(row) {
    return new combo_anunciante_1.ComboAnunciante({
        idComboAnunciante: Number(row.IdComboAnunciante),
        comboAnunciante: row.ComboAnunciante,
        marcas: row.CombosAnunciantesDetalles.map((item) => ({
            idMarcaProducto: Number(item.IdMarcaProducto),
            marcaProducto: item.MarcasProductos.MarcaProducto,
            anunciante: item.MarcasProductos.Anunciantes.Anunciante,
            orden: item.Orden,
        })),
        activo: row.Activo,
        fechaCreacion: row.FechaCreacion,
        fechaActualizacion: row.FechaActualizacion,
        creadoPor: row.CreadoPor === null ? null : Number(row.CreadoPor),
        actualizadoPor: row.ActualizadoPor === null ? null : Number(row.ActualizadoPor),
    });
}
class PrismaComboAnuncianteRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
        const rows = await this.prisma.combosAnunciantes.findMany({
            include: {
                CombosAnunciantesDetalles: {
                    orderBy: { Orden: 'asc' },
                    include: {
                        MarcasProductos: {
                            select: {
                                MarcaProducto: true,
                                Anunciantes: { select: { Anunciante: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { ComboAnunciante: 'asc' },
        });
        return rows.map(mapRow);
    }
    async findById(idComboAnunciante) {
        const row = await this.prisma.combosAnunciantes.findUnique({
            where: { IdComboAnunciante: BigInt(idComboAnunciante) },
            include: {
                CombosAnunciantesDetalles: {
                    orderBy: { Orden: 'asc' },
                    include: {
                        MarcasProductos: {
                            select: {
                                MarcaProducto: true,
                                Anunciantes: { select: { Anunciante: true } },
                            },
                        },
                    },
                },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findMarcasByIds(idsMarcas) {
        if (idsMarcas.length === 0) {
            return [];
        }
        const rows = await this.prisma.marcasProductos.findMany({
            where: {
                IdMarcaProducto: { in: idsMarcas.map((id) => BigInt(id)) },
            },
            select: { IdMarcaProducto: true },
        });
        return rows.map((row) => Number(row.IdMarcaProducto));
    }
    async findMarcaProductoOptions() {
        const rows = await this.prisma.marcasProductos.findMany({
            where: { Activo: true },
            include: {
                Anunciantes: { select: { Anunciante: true } },
            },
            orderBy: [{ Anunciantes: { Anunciante: 'asc' } }, { MarcaProducto: 'asc' }],
        });
        return rows.map((row) => ({
            idMarcaProducto: Number(row.IdMarcaProducto),
            marcaProducto: row.MarcaProducto,
            anunciante: row.Anunciantes.Anunciante,
        }));
    }
    async create(input) {
        const created = await this.prisma.$transaction(async (tx) => {
            const combo = await tx.combosAnunciantes.create({
                data: {
                    ComboAnunciante: input.comboAnunciante,
                    Activo: true,
                    FechaCreacion: new Date(),
                    FechaActualizacion: new Date(),
                    CreadoPor: BigInt(input.creadoPor),
                    ActualizadoPor: BigInt(input.creadoPor),
                },
            });
            await tx.combosAnunciantesDetalles.createMany({
                data: input.marcas.map((marca) => ({
                    IdComboAnunciante: combo.IdComboAnunciante,
                    IdMarcaProducto: BigInt(marca.idMarcaProducto),
                    Orden: marca.orden,
                    FechaCreacion: new Date(),
                    CreadoPor: BigInt(input.creadoPor),
                })),
            });
            return tx.combosAnunciantes.findUnique({
                where: { IdComboAnunciante: combo.IdComboAnunciante },
                include: {
                    CombosAnunciantesDetalles: {
                        orderBy: { Orden: 'asc' },
                        include: {
                            MarcasProductos: {
                                select: {
                                    MarcaProducto: true,
                                    Anunciantes: { select: { Anunciante: true } },
                                },
                            },
                        },
                    },
                },
            });
        });
        return mapRow(created);
    }
    async update(idComboAnunciante, input) {
        const updated = await this.prisma.$transaction(async (tx) => {
            await tx.combosAnunciantes.update({
                where: { IdComboAnunciante: BigInt(idComboAnunciante) },
                data: {
                    ...(input.comboAnunciante !== undefined ? { ComboAnunciante: input.comboAnunciante } : {}),
                    ...(input.activo !== undefined ? { Activo: input.activo } : {}),
                    FechaActualizacion: new Date(),
                    ActualizadoPor: BigInt(input.actualizadoPor),
                },
            });
            if (input.marcas !== undefined) {
                await tx.combosAnunciantesDetalles.deleteMany({
                    where: { IdComboAnunciante: BigInt(idComboAnunciante) },
                });
                await tx.combosAnunciantesDetalles.createMany({
                    data: input.marcas.map((marca) => ({
                        IdComboAnunciante: BigInt(idComboAnunciante),
                        IdMarcaProducto: BigInt(marca.idMarcaProducto),
                        Orden: marca.orden,
                        FechaCreacion: new Date(),
                        CreadoPor: BigInt(input.actualizadoPor),
                    })),
                });
            }
            return tx.combosAnunciantes.findUnique({
                where: { IdComboAnunciante: BigInt(idComboAnunciante) },
                include: {
                    CombosAnunciantesDetalles: {
                        orderBy: { Orden: 'asc' },
                        include: {
                            MarcasProductos: {
                                select: {
                                    MarcaProducto: true,
                                    Anunciantes: { select: { Anunciante: true } },
                                },
                            },
                        },
                    },
                },
            });
        });
        return mapRow(updated);
    }
    async deactivate(idComboAnunciante, actualizadoPor) {
        await this.prisma.combosAnunciantes.update({
            where: { IdComboAnunciante: BigInt(idComboAnunciante) },
            data: {
                Activo: false,
                FechaActualizacion: new Date(),
                ActualizadoPor: BigInt(actualizadoPor),
            },
        });
    }
}
exports.PrismaComboAnuncianteRepository = PrismaComboAnuncianteRepository;
//# sourceMappingURL=prisma-combo-anunciante.repository.js.map