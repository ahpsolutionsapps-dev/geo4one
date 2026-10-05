"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubSectoresIndustrialesOptionsUseCase = void 0;
class GetSubSectoresIndustrialesOptionsUseCase {
    anunciantes;
    constructor(anunciantes) {
        this.anunciantes = anunciantes;
    }
    async execute(idSectorIndustrial) {
        return this.anunciantes.findSubSectoresOptions(idSectorIndustrial);
    }
}
exports.GetSubSectoresIndustrialesOptionsUseCase = GetSubSectoresIndustrialesOptionsUseCase;
//# sourceMappingURL=get-sub-sectores-industriales-options.use-case.js.map