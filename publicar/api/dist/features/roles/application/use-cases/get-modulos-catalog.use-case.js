"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetModulosCatalogUseCase = void 0;
class GetModulosCatalogUseCase {
    modulos;
    constructor(modulos) {
        this.modulos = modulos;
    }
    async execute(options) {
        const includeHidden = options?.includeHidden === true;
        const rows = await this.modulos.findAll({ includeHidden });
        return rows.map((modulo) => ({
            idModulo: modulo.idModulo,
            codigo: modulo.codigo,
            nombreModulo: modulo.nombreModulo,
            icono: modulo.icono,
            ruta: modulo.ruta,
            idPadre: modulo.idPadre,
            orderIndex: modulo.orderIndex,
            oculto: modulo.oculto,
        }));
    }
}
exports.GetModulosCatalogUseCase = GetModulosCatalogUseCase;
//# sourceMappingURL=get-modulos-catalog.use-case.js.map