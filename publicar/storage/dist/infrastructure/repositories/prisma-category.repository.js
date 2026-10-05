"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCategoryRepository = void 0;
const uuid_1 = require("uuid");
const mappers_1 = require("../database/mappers");
const prisma_client_1 = require("../database/prisma.client");
class PrismaCategoryRepository {
    async findOrCreateByNames(names) {
        const categories = [];
        for (const name of names) {
            const normalized = name.trim();
            if (!normalized)
                continue;
            const existing = await prisma_client_1.prisma.fileCategory.findFirst({
                where: { name: normalized },
            });
            if (existing) {
                categories.push((0, mappers_1.mapCategory)(existing));
                continue;
            }
            const created = await prisma_client_1.prisma.fileCategory.create({
                data: { id: (0, uuid_1.v4)(), name: normalized },
            });
            categories.push((0, mappers_1.mapCategory)(created));
        }
        return categories;
    }
    async assignToFile(fileId, categoryIds) {
        await prisma_client_1.prisma.fileCategoryRelation.deleteMany({ where: { fileId } });
        if (categoryIds.length === 0)
            return;
        await prisma_client_1.prisma.fileCategoryRelation.createMany({
            data: categoryIds.map((categoryId) => ({ fileId, categoryId })),
        });
    }
}
exports.PrismaCategoryRepository = PrismaCategoryRepository;
//# sourceMappingURL=prisma-category.repository.js.map