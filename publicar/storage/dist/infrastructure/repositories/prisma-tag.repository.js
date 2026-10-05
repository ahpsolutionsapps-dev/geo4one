"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTagRepository = void 0;
const uuid_1 = require("uuid");
const mappers_1 = require("../database/mappers");
const prisma_client_1 = require("../database/prisma.client");
class PrismaTagRepository {
    async findOrCreateByNames(names) {
        const tags = [];
        for (const name of names) {
            const normalized = name.trim().toLowerCase();
            if (!normalized)
                continue;
            const existing = await prisma_client_1.prisma.tag.findUnique({ where: { name: normalized } });
            if (existing) {
                tags.push((0, mappers_1.mapTag)(existing));
                continue;
            }
            const created = await prisma_client_1.prisma.tag.create({
                data: { id: (0, uuid_1.v4)(), name: normalized },
            });
            tags.push((0, mappers_1.mapTag)(created));
        }
        return tags;
    }
    async assignToFile(fileId, tagIds) {
        await prisma_client_1.prisma.fileTag.deleteMany({ where: { fileId } });
        if (tagIds.length === 0)
            return;
        await prisma_client_1.prisma.fileTag.createMany({
            data: tagIds.map((tagId) => ({ fileId, tagId })),
        });
    }
}
exports.PrismaTagRepository = PrismaTagRepository;
//# sourceMappingURL=prisma-tag.repository.js.map