"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSectoresIndustrialesOptionsUseCase = void 0;
class GetSectoresIndustrialesOptionsUseCase {
    anunciantes;
    constructor(anunciantes) {
        this.anunciantes = anunciantes;
    }
    async execute() {
        return this.anunciantes.findSectoresOptions();
    }
}
exports.GetSectoresIndustrialesOptionsUseCase = GetSectoresIndustrialesOptionsUseCase;
//# sourceMappingURL=get-sectores-industriales-options.use-case.js.map