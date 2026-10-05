"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMarcaProductoUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateMarcaProductoUseCase {
    marcasProductos;
    constructor(marcasProductos) {
        this.marcasProductos = marcasProductos;
    }
    async execute(idMarcaProducto, input) {
        const existing = await this.marcasProductos.findById(idMarcaProducto);
        if (!existing) {
            throw new app_error_1.NotFoundError('Marca / producto no encontrado');
        }
        const existingData = existing.toPrimitives();
        const nextAnunciante = input.idAnunciante ?? existingData.idAnunciante;
        const nextCategoria = input.idCategoriaAnunciante ?? existingData.idCategoriaAnunciante;
        const nextMarcaProducto = input.marcaProducto?.trim() ?? existingData.marcaProducto;
        const anunciante = await this.marcasProductos.findAnuncianteById(nextAnunciante);
        if (!anunciante) {
            throw new app_error_1.NotFoundError('Anunciante no encontrado');
        }
        const categoria = await this.marcasProductos.findCategoriaById(nextCategoria);
        if (!categoria) {
            throw new app_error_1.NotFoundError('Categoría de anunciante no encontrada');
        }
        if (anunciante.idCategoriaAnunciante !== nextCategoria) {
            throw new app_error_1.ValidationError('La categoría seleccionada no corresponde al anunciante');
        }
        const existingByName = await this.marcasProductos.findByNombreInAnunciante(nextAnunciante, nextMarcaProducto);
        if (existingByName && existingByName.toPrimitives().idMarcaProducto !== idMarcaProducto) {
            throw new app_error_1.ConflictError('Ya existe una marca / producto con ese nombre para ese anunciante');
        }
        const updated = await this.marcasProductos.update(idMarcaProducto, {
            idAnunciante: input.idAnunciante,
            idCategoriaAnunciante: input.idCategoriaAnunciante,
            marcaProducto: input.marcaProducto?.trim(),
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateMarcaProductoUseCase = UpdateMarcaProductoUseCase;
//# sourceMappingURL=update-marca-producto.use-case.js.map