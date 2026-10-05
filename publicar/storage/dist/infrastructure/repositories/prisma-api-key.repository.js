"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaApiKeyRepository = void 0;
const mappers_1 = require("../database/mappers");
const prisma_client_1 = require("../database/prisma.client");
class PrismaApiKeyRepository {
    async create(data) {
        const record = await prisma_client_1.prisma.apiKey.create({
            data: {
                id: data.id,
                name: data.name,
                apiKey: data.apiKey,
                isActive: data.isActive,
            },
        });
        return (0, mappers_1.mapApiKey)(record);
    }
    async findByKey(apiKey) {
        const record = await prisma_client_1.prisma.apiKey.findUnique({ where: { apiKey } });
        return record ? (0, mappers_1.mapApiKey)(record) : null;
    }
    async findById(id) {
        const record = await prisma_client_1.prisma.apiKey.findUnique({ where: { id } });
        return record ? (0, mappers_1.mapApiKey)(record) : null;
    }
    async list() {
        const records = await prisma_client_1.prisma.apiKey.findMany({ orderBy: { createdAt: 'desc' } });
        return records.map(mappers_1.mapApiKey);
    }
    async updateStatus(id, isActive) {
        const record = await prisma_client_1.prisma.apiKey.update({
            where: { id },
            data: { isActive },
        });
        return (0, mappers_1.mapApiKey)(record);
    }
    async updateLastUsed(id) {
        await prisma_client_1.prisma.apiKey.update({
            where: { id },
            data: { lastUsedAt: new Date() },
        });
    }
    async delete(id) {
        await prisma_client_1.prisma.apiKey.delete({ where: { id } });
    }
}
exports.PrismaApiKeyRepository = PrismaApiKeyRepository;
//# sourceMappingURL=prisma-api-key.repository.js.map