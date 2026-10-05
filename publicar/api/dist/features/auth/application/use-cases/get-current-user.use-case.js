"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrentUserUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetCurrentUserUseCase {
    users;
    constructor(users) {
        this.users = users;
    }
    async execute(idUsuario) {
        const user = await this.users.findById(idUsuario);
        if (!user) {
            throw new app_error_1.NotFoundError('Usuario no encontrado');
        }
        if (!user.canLogin()) {
            throw new app_error_1.UnauthorizedError(user.anulado
                ? 'Tu cuenta ha sido anulada'
                : 'Tu cuenta está deshabilitada');
        }
        return { user: user.toPublic() };
    }
}
exports.GetCurrentUserUseCase = GetCurrentUserUseCase;
//# sourceMappingURL=get-current-user.use-case.js.map