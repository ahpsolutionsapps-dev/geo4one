"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class ResetPasswordUseCase {
    users;
    hasher;
    constructor(users, hasher) {
        this.users = users;
        this.hasher = hasher;
    }
    async execute(input) {
        const email = input.email.trim();
        const palabraSecreta = input.palabraSecreta.trim();
        const user = await this.users.findByEmail(email);
        if (!user || !user.canLogin() || !user.palabraSecreta) {
            throw new app_error_1.UnauthorizedError('No fue posible recuperar la contraseña. Verifica el correo y la palabra secreta.');
        }
        const secretMatches = user.palabraSecreta.trim().toLowerCase() === palabraSecreta.toLowerCase();
        if (!secretMatches) {
            throw new app_error_1.UnauthorizedError('No fue posible recuperar la contraseña. Verifica el correo y la palabra secreta.');
        }
        const hashed = await this.hasher.hash(input.password);
        await this.users.updatePassword(user.idUsuario, hashed);
        return { message: 'Contraseña actualizada correctamente' };
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
//# sourceMappingURL=reset-password.use-case.js.map