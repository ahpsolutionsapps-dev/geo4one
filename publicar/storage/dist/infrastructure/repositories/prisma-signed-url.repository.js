"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSignedUrlRepository = void 0;
const mappers_1 = require("../database/mappers");
const prisma_client_1 = require("../database/prisma.client");
class PrismaSignedUrlRepository {
    async create(data) {
        const record = await prisma_client_1.prisma.signedUrl.create({ data });
        return (0, mappers_1.mapSignedUrl)(record);
    }
    async findByToken(token) {
        const record = await prisma_client_1.prisma.signedUrl.findUnique({ where: { token } });
        return record ? (0, mappers_1.mapSignedUrl)(record) : null;
    }
    async deleteExpired() {
        await prisma_client_1.prisma.signedUrl.deleteMany({
            where: { expiresAt: { lt: new Date() } },
        });
    }
}
exports.PrismaSignedUrlRepository = PrismaSignedUrlRepository;
//# sourceMappingURL=prisma-signed-url.repository.js.map