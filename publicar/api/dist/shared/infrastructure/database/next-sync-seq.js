"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextSyncSeq = nextSyncSeq;
async function nextSyncSeq(prisma, sequenceName) {
    const rows = await prisma.$queryRawUnsafe(`SELECT nextval('"${sequenceName}"') as next`);
    return Number(rows[0]?.next ?? 0);
}
//# sourceMappingURL=next-sync-seq.js.map