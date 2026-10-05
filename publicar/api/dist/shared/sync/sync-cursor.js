"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SNAPSHOT_HISTORY_DAYS = void 0;
exports.snapshotSinceDate = snapshotSinceDate;
exports.SNAPSHOT_HISTORY_DAYS = 90;
function snapshotSinceDate(days = exports.SNAPSHOT_HISTORY_DAYS) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
//# sourceMappingURL=sync-cursor.js.map