"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFileRepository = void 0;
const mappers_1 = require("../database/mappers");
const prisma_client_1 = require("../database/prisma.client");
class PrismaFileRepository {
    async create(data) {
        const record = await prisma_client_1.prisma.file.create({
            data: {
                id: data.id,
                fileName: data.fileName,
                originalFileName: data.originalFileName,
                extension: data.extension,
                mimeType: data.mimeType,
                fileSize: BigInt(data.fileSize),
                storagePath: data.storagePath,
                hash: data.hash,
            },
        });
        return (0, mappers_1.mapFile)(record);
    }
    async findById(id, includeDeleted = false) {
        const record = await prisma_client_1.prisma.file.findFirst({
            where: {
                id,
                ...(includeDeleted ? {} : { deletedAt: null }),
            },
        });
        return record ? (0, mappers_1.mapFile)(record) : null;
    }
    async findByHash(hash) {
        const record = await prisma_client_1.prisma.file.findFirst({
            where: { hash, deletedAt: null },
        });
        return record ? (0, mappers_1.mapFile)(record) : null;
    }
    async list(filters, pagination) {
        const where = {
            ...(filters.includeDeleted ? {} : { deletedAt: null }),
        };
        if (filters.fileName) {
            where.OR = [
                { fileName: { contains: filters.fileName } },
                { originalFileName: { contains: filters.fileName } },
            ];
        }
        if (filters.mimeType) {
            where.mimeType = { contains: filters.mimeType };
        }
        if (filters.dateFrom || filters.dateTo) {
            where.createdAt = {
                ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
                ...(filters.dateTo ? { lte: filters.dateTo } : {}),
            };
        }
        if (filters.category) {
            where.categories = {
                some: {
                    category: {
                        name: { equals: filters.category },
                    },
                },
            };
        }
        if (filters.tag) {
            where.tags = {
                some: {
                    tag: {
                        name: { equals: filters.tag },
                    },
                },
            };
        }
        const skip = (pagination.page - 1) * pagination.limit;
        const [records, total] = await Promise.all([
            prisma_client_1.prisma.file.findMany({
                where,
                skip,
                take: pagination.limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_client_1.prisma.file.count({ where }),
        ]);
        return {
            items: records.map(mappers_1.mapFile),
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.max(1, Math.ceil(total / pagination.limit)),
        };
    }
    async softDelete(id) {
        await prisma_client_1.prisma.file.update({
            where: { id },
            data: { deletedAt: new Date(), updatedAt: new Date() },
        });
    }
    async restore(id) {
        await prisma_client_1.prisma.file.update({
            where: { id },
            data: { deletedAt: null, updatedAt: new Date() },
        });
    }
    async hardDelete(id) {
        await prisma_client_1.prisma.file.delete({ where: { id } });
    }
}
exports.PrismaFileRepository = PrismaFileRepository;
//# sourceMappingURL=prisma-file.repository.js.map