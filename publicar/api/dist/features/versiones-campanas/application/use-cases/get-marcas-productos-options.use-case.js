"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMarcasProductosOptionsUseCase = void 0;
class GetMarcasProductosOptionsUseCase {
    versionesCampanas;
    constructor(versionesCampanas) {
        this.versionesCampanas = versionesCampanas;
    }
    async execute(idAnunciante) {
        return this.versionesCampanas.findMarcasProductosOptions(idAnunciante);
    }
}
exports.GetMarcasProductosOptionsUseCase = GetMarcasProductosOptionsUseCase;
//# sourceMappingURL=get-marcas-productos-options.use-case.js.map