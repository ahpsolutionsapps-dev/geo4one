"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRolesUseCase = void 0;
class GetRolesUseCase {
    roles;
    constructor(roles) {
        this.roles = roles;
    }
    async execute(filters) {
        const rows = await this.roles.findMany(filters);
        return rows.map((row) => row.toPrimitives());
    }
}
exports.GetRolesUseCase = GetRolesUseCase;
//# sourceMappingURL=get-roles.use-case.js.map