"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVersionesCampanasUseCase = void 0;
class GetVersionesCampanasUseCase {
    versionesCampanas;
    constructor(versionesCampanas) {
        this.versionesCampanas = versionesCampanas;
    }
    async execute() {
        const items = await this.versionesCampanas.findMany();
        return items.map((item) => item.toPrimitives());
    }
}
exports.GetVersionesCampanasUseCase = GetVersionesCampanasUseCase;
//# sourceMappingURL=get-versiones-campanas.use-case.js.map