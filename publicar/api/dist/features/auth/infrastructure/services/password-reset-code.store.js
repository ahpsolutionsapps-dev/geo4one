"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetCodeStore = exports.PasswordResetCodeStore = void 0;
const crypto_1 = require("crypto");
const CODE_TTL_MS = 10 * 60 * 1000;
function hashCode(email, code) {
    return (0, crypto_1.createHash)('sha256')
        .update(`${email.trim().toLowerCase()}:${code}`)
        .digest('hex');
}
class PasswordResetCodeStore {
    entries = new Map();
    create(email) {
        const normalizedEmail = email.trim().toLowerCase();
        const code = String((0, crypto_1.randomInt)(100000, 1000000));
        const expiresAt = Date.now() + CODE_TTL_MS;
        this.entries.set(normalizedEmail, {
            email: normalizedEmail,
            codeHash: hashCode(normalizedEmail, code),
            expiresAt,
            attempts: 0,
        });
        return { code, expiresAt: new Date(expiresAt) };
    }
    consume(email, code) {
        const normalizedEmail = email.trim().toLowerCase();
        const entry = this.entries.get(normalizedEmail);
        if (!entry) {
            return false;
        }
        if (Date.now() > entry.expiresAt) {
            this.entries.delete(normalizedEmail);
            return false;
        }
        entry.attempts += 1;
        if (entry.attempts > 5) {
            this.entries.delete(normalizedEmail);
            return false;
        }
        const ok = entry.codeHash === hashCode(normalizedEmail, code.trim());
        if (ok) {
            this.entries.delete(normalizedEmail);
        }
        return ok;
    }
    invalidate(email) {
        this.entries.delete(email.trim().toLowerCase());
    }
}
exports.PasswordResetCodeStore = PasswordResetCodeStore;
exports.passwordResetCodeStore = new PasswordResetCodeStore();
//# sourceMappingURL=password-reset-code.store.js.map