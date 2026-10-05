"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateMunicipioUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateMunicipioUseCase {
    municipios;
    constructor(municipios) {
        this.municipios = municipios;
    }
    async execute(idMunicipio, actualizadoPor) {
        const existing = await this.municipios.findById(idMunicipio);
        if (!existing) {
            throw new app_error_1.NotFoundError('Municipio no encontrado');
        }
        await this.municipios.deactivate(idMunicipio, actualizadoPor);
    }
}
exports.DeactivateMunicipioUseCase = DeactivateMunicipioUseCase;
//# sourceMappingURL=deactivate-municipio.use-case.js.map