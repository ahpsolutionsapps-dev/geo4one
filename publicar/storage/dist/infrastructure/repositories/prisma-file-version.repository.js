"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFileVersionRepository = void 0;
const mappers_1 = require("../database/mappers");
const prisma_client_1 = require("../database/prisma.client");
class PrismaFileVersionRepository {
    async create(data) {
        const record = await prisma_client_1.prisma.fileVersion.create({
            data: { ...data, fileSize: BigInt(data.fileSize) },
        });
        return (0, mappers_1.mapFileVersion)(record);
    }
    async listByFileId(fileId) {
        const records = await prisma_client_1.prisma.fileVersion.findMany({
            where: { fileId },
            orderBy: { versionNumber: 'desc' },
        });
        return records.map(mappers_1.mapFileVersion);
    }
    async getLatestVersionNumber(fileId) {
        const latest = await prisma_client_1.prisma.fileVersion.findFirst({
            where: { fileId },
            orderBy: { versionNumber: 'desc' },
        });
        return latest?.versionNumber ?? 0;
    }
}
exports.PrismaFileVersionRepository = PrismaFileVersionRepository;
//# sourceMappingURL=prisma-file-version.repository.js.map