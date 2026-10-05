"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCombosAnunciantesOptionsUseCase = void 0;
class GetCombosAnunciantesOptionsUseCase {
    versionesCampanas;
    constructor(versionesCampanas) {
        this.versionesCampanas = versionesCampanas;
    }
    async execute() {
        return this.versionesCampanas.findCombosAnunciantesOptions();
    }
}
exports.GetCombosAnunciantesOptionsUseCase = GetCombosAnunciantesOptionsUseCase;
//# sourceMappingURL=get-combos-anunciantes-options.use-case.js.map