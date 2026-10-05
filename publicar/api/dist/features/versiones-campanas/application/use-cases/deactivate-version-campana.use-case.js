"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateVersionCampanaUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class DeactivateVersionCampanaUseCase {
    versionesCampanas;
    constructor(versionesCampanas) {
        this.versionesCampanas = versionesCampanas;
    }
    async execute(idVersionCampana, actualizadoPor) {
        const existing = await this.versionesCampanas.findById(idVersionCampana);
        if (!existing) {
            throw new app_error_1.NotFoundError('Version de campana no encontrada');
        }
        await this.versionesCampanas.deactivate(idVersionCampana, actualizadoPor);
    }
}
exports.DeactivateVersionCampanaUseCase = DeactivateVersionCampanaUseCase;
//# sourceMappingURL=deactivate-version-campana.use-case.js.map