"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAuditLogRepository = void 0;
const prisma_client_1 = require("../database/prisma.client");
class PrismaAuditLogRepository {
    async create(data) {
        await prisma_client_1.prisma.auditLog.create({ data });
    }
}
exports.PrismaAuditLogRepository = PrismaAuditLogRepository;
//# sourceMappingURL=prisma-audit-log.repository.js.map