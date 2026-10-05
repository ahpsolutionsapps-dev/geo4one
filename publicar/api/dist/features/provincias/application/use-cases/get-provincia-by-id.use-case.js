"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProvinciaByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetProvinciaByIdUseCase {
    provincias;
    constructor(provincias) {
        this.provincias = provincias;
    }
    async execute(idProvincia) {
        const provincia = await this.provincias.findById(idProvincia);
        if (!provincia) {
            throw new app_error_1.NotFoundError('Provincia no encontrada');
        }
        return provincia.toPrimitives();
    }
}
exports.GetProvinciaByIdUseCase = GetProvinciaByIdUseCase;
//# sourceMappingURL=get-provincia-by-id.use-case.js.map