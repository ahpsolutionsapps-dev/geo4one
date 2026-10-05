"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsuariosUseCase = void 0;
const usuario_response_mapper_1 = require("../mappers/usuario-response.mapper");
class GetUsuariosUseCase {
    usuarios;
    constructor(usuarios) {
        this.usuarios = usuarios;
    }
    async execute(filters) {
        const rows = await this.usuarios.findMany(filters);
        return rows.map((row) => (0, usuario_response_mapper_1.toUsuarioResponse)(row.toPrimitives()));
    }
}
exports.GetUsuariosUseCase = GetUsuariosUseCase;
//# sourceMappingURL=get-usuarios.use-case.js.map