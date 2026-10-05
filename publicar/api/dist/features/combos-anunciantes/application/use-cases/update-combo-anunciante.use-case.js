"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComboAnuncianteUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
function validateMarcasInput(marcas) {
    if (marcas.length === 0) {
        throw new app_error_1.ValidationError('Debes seleccionar al menos una marca de producto');
    }
    const seenMarcas = new Set();
    const seenOrden = new Set();
    for (const item of marcas) {
        if (seenMarcas.has(item.idMarcaProducto)) {
            throw new app_error_1.ValidationError('No puedes repetir marcas de producto en el mismo combo');
        }
        if (seenOrden.has(item.orden)) {
            throw new app_error_1.ValidationError('No puedes repetir el orden de marcas en el mismo combo');
        }
        seenMarcas.add(item.idMarcaProducto);
        seenOrden.add(item.orden);
    }
}
class UpdateComboAnuncianteUseCase {
    combosAnunciantes;
    constructor(combosAnunciantes) {
        this.combosAnunciantes = combosAnunciantes;
    }
    async execute(idComboAnunciante, input) {
        const existing = await this.combosAnunciantes.findById(idComboAnunciante);
        if (!existing) {
            throw new app_error_1.NotFoundError('Combo de anunciante no encontrado');
        }
        if (input.marcas !== undefined) {
            validateMarcasInput(input.marcas);
            const existingMarcas = await this.combosAnunciantes.findMarcasByIds(input.marcas.map((item) => item.idMarcaProducto));
            if (existingMarcas.length !== input.marcas.length) {
                throw new app_error_1.NotFoundError('Una o mas marcas de producto no existen');
            }
        }
        const updated = await this.combosAnunciantes.update(idComboAnunciante, {
            comboAnunciante: input.comboAnunciante?.trim(),
            marcas: input.marcas,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateComboAnuncianteUseCase = UpdateComboAnuncianteUseCase;
//# sourceMappingURL=update-combo-anunciante.use-case.js.map