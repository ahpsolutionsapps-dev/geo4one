"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetColocacionesUseCase = void 0;
class GetColocacionesUseCase {
    colocaciones;
    constructor(colocaciones) {
        this.colocaciones = colocaciones;
    }
    async execute() {
        const items = await this.colocaciones.findMany();
        return items.map((item) => item.toPrimitives());
    }
}
exports.GetColocacionesUseCase = GetColocacionesUseCase;
//# sourceMappingURL=get-colocaciones.use-case.js.map