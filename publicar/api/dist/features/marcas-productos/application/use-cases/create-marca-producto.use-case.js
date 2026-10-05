"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMarcaProductoUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateMarcaProductoUseCase {
    marcasProductos;
    constructor(marcasProductos) {
        this.marcasProductos = marcasProductos;
    }
    async execute(input) {
        const marcaProducto = input.marcaProducto.trim();
        const anunciante = await this.marcasProductos.findAnuncianteById(input.idAnunciante);
        if (!anunciante) {
            throw new app_error_1.NotFoundError('Anunciante no encontrado');
        }
        const categoria = await this.marcasProductos.findCategoriaById(input.idCategoriaAnunciante);
        if (!categoria) {
            throw new app_error_1.NotFoundError('Categoría de anunciante no encontrada');
        }
        if (anunciante.idCategoriaAnunciante !== input.idCategoriaAnunciante) {
            throw new app_error_1.ValidationError('La categoría seleccionada no corresponde al anunciante');
        }
        const existing = await this.marcasProductos.findByNombreInAnunciante(input.idAnunciante, marcaProducto);
        if (existing) {
            throw new app_error_1.ConflictError('Ya existe una marca / producto con ese nombre para ese anunciante');
        }
        const created = await this.marcasProductos.create({
            idAnunciante: input.idAnunciante,
            idCategoriaAnunciante: input.idCategoriaAnunciante,
            marcaProducto,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateMarcaProductoUseCase = CreateMarcaProductoUseCase;
//# sourceMappingURL=create-marca-producto.use-case.js.map