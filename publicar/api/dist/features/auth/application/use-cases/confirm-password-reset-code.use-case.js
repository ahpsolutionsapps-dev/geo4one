"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmPasswordResetCodeUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class ConfirmPasswordResetCodeUseCase {
    users;
    hasher;
    codes;
    constructor(users, hasher, codes) {
        this.users = users;
        this.hasher = hasher;
        this.codes = codes;
    }
    async execute(input) {
        const email = input.email.trim();
        const user = await this.users.findByEmail(email);
        if (!user || !user.canLogin()) {
            throw new app_error_1.UnauthorizedError('Código inválido o expirado. Solicita uno nuevo.');
        }
        const valid = this.codes.consume(email, input.code);
        if (!valid) {
            throw new app_error_1.UnauthorizedError('Código inválido o expirado. Solicita uno nuevo.');
        }
        const hashed = await this.hasher.hash(input.password);
        await this.users.updatePassword(user.idUsuario, hashed);
        return { message: 'Contraseña actualizada correctamente' };
    }
}
exports.ConfirmPasswordResetCodeUseCase = ConfirmPasswordResetCodeUseCase;
//# sourceMappingURL=confirm-password-reset-code.use-case.js.map