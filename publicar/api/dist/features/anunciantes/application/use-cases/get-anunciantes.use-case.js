"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAnunciantesUseCase = void 0;
class GetAnunciantesUseCase {
    anunciantes;
    constructor(anunciantes) {
        this.anunciantes = anunciantes;
    }
    async execute() {
        const items = await this.anunciantes.findMany();
        return items.map((item) => item.toPrimitives());
    }
}
exports.GetAnunciantesUseCase = GetAnunciantesUseCase;
//# sourceMappingURL=get-anunciantes.use-case.js.map