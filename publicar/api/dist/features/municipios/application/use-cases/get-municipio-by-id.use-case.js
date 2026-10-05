"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMunicipioByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetMunicipioByIdUseCase {
    municipios;
    constructor(municipios) {
        this.municipios = municipios;
    }
    async execute(idMunicipio) {
        const municipio = await this.municipios.findById(idMunicipio);
        if (!municipio) {
            throw new app_error_1.NotFoundError('Municipio no encontrado');
        }
        return municipio.toPrimitives();
    }
}
exports.GetMunicipioByIdUseCase = GetMunicipioByIdUseCase;
//# sourceMappingURL=get-municipio-by-id.use-case.js.map