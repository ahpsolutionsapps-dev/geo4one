"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class LoginUserUseCase {
    users;
    hasher;
    tokens;
    constructor(users, hasher, tokens) {
        this.users = users;
        this.hasher = hasher;
        this.tokens = tokens;
    }
    async execute(input) {
        const user = await this.users.findByEmail(input.email);
        if (!user || !user.canLogin()) {
            throw new app_error_1.UnauthorizedError('Credenciales inválidas');
        }
        const ok = await this.hasher.compare(input.password, user.userpassword);
        if (!ok) {
            throw new app_error_1.UnauthorizedError('Credenciales inválidas');
        }
        const token = this.tokens.sign({ sub: String(user.idUsuario), username: user.username });
        return { user: user.toPublic(), token };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
//# sourceMappingURL=login-user.use-case.js.map