"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVersionCampanaByIdUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class GetVersionCampanaByIdUseCase {
    versionesCampanas;
    constructor(versionesCampanas) {
        this.versionesCampanas = versionesCampanas;
    }
    async execute(idVersionCampana) {
        const item = await this.versionesCampanas.findById(idVersionCampana);
        if (!item) {
            throw new app_error_1.NotFoundError('Version de campana no encontrada');
        }
        return item.toPrimitives();
    }
}
exports.GetVersionCampanaByIdUseCase = GetVersionCampanaByIdUseCase;
//# sourceMappingURL=get-version-campana-by-id.use-case.js.map