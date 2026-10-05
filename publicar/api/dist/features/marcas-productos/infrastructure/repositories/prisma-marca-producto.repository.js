"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMarcaProductoRepository = void 0;
const marca_producto_1 = require("../../domain/entities/marca-producto");
function mapRow(row) {
    return new marca_producto_1.MarcaProducto({
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
class PrismaMarcaProductoRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany() {
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
    async findById(idMarcaProducto) {
        const row = await this.prisma.marcasProductos.findUnique({
            where: { IdMarcaProducto: BigInt(idMarcaProducto) },
            include: {
                Anunciantes: { select: { Anunciante: true } },
                CategoriasAnunciantes: { select: { CategoriaAnunciante: true } },
            },
        });
        return row ? mapRow(row) : null;
    }
    async findByNombreInAnunciante(idAnunciante, marcaProducto) {
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
    async findAnuncianteById(idAnunciante) {
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
    async findCategoriaById(idCategoriaAnunciante) {
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
    async create(input) {
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
    async update(idMarcaProducto, input) {
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
    async deactivate(idMarcaProducto, actualizadoPor) {
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
exports.PrismaMarcaProductoRepository = PrismaMarcaProductoRepository;
//# sourceMappingURL=prisma-marca-producto.repository.js.map