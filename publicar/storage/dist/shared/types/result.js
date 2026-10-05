"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.fail = fail;
exports.isOk = isOk;
exports.isFail = isFail;
function ok(value) {
    return { success: true, value };
}
function fail(error) {
    return { success: false, error };
}
function isOk(result) {
    return result.success;
}
function isFail(result) {
    return !result.success;
}
//# sourceMappingURL=result.js.map