"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAssignableModulos = ensureAssignableModulos;
const app_error_1 = require("../../../../core/errors/app-error");
async function ensureAssignableModulos(modulos, idModulos, options) {
    const unique = [...new Set(idModulos)];
    if (unique.length === 0 || options?.allowHidden === true) {
        return unique;
    }
    const hiddenIds = await modulos.findHiddenIds(unique);
    if (hiddenIds.length > 0) {
        throw new app_error_1.ValidationError('No se pueden asignar módulos ocultos a un rol');
    }
    return unique;
}
//# sourceMappingURL=ensure-assignable-modulos.js.map