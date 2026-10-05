"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAnunciantesOptionsUseCase = void 0;
class GetAnunciantesOptionsUseCase {
    versionesCampanas;
    constructor(versionesCampanas) {
        this.versionesCampanas = versionesCampanas;
    }
    async execute() {
        return this.versionesCampanas.findAnunciantesOptions();
    }
}
exports.GetAnunciantesOptionsUseCase = GetAnunciantesOptionsUseCase;
//# sourceMappingURL=get-anunciantes-options.use-case.js.map