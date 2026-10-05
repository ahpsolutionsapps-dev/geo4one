"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class RegisterUserUseCase {
    users;
    hasher;
    tokens;
    constructor(users, hasher, tokens) {
        this.users = users;
        this.hasher = hasher;
        this.tokens = tokens;
    }
    async execute(input) {
        const existing = await this.users.findByUsername(input.username);
        if (existing) {
            throw new app_error_1.ConflictError('El nombre de usuario ya está registrado');
        }
        const userpassword = await this.hasher.hash(input.password);
        const user = await this.users.create({
            idNegocio: 1,
            username: input.username,
            email: input.email,
            userpassword,
            nombre: input.username,
            apellido: null,
            telefono: null,
            idRol: input.idRol ?? null,
            palabraSecreta: input.palabraSecreta ?? null,
            habilitado: true,
            imagen: null,
            idUsuarioRegistra: input.idUsuarioRegistra ?? null,
            idUsuarioModifica: null,
            fechaModificacion: null,
            anulado: false,
            idUsuarioAnula: null,
            fechaAnulado: null,
            comentario: input.comentario ?? null,
            verificado: false,
            estatus: 1,
            idioma: 'es',
            tema: 'sistema',
            intentosFallidos: 0,
        });
        const token = this.tokens.sign({ sub: String(user.idUsuario), username: user.username });
        return { user: user.toPublic(), token };
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
//# sourceMappingURL=register-user.use-case.js.map