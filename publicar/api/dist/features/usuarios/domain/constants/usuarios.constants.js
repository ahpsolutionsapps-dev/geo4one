"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROTECTED_USUARIO_ID = void 0;
exports.assertUsuarioMutable = assertUsuarioMutable;
const app_error_1 = require("../../../../core/errors/app-error");
exports.PROTECTED_USUARIO_ID = 1;
function assertUsuarioMutable(idUsuario) {
    if (idUsuario === exports.PROTECTED_USUARIO_ID) {
        throw new app_error_1.ValidationError('El usuario administrador no puede modificarse');
    }
}
//# sourceMappingURL=usuarios.constants.js.map