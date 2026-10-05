"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateColocacionUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateColocacionUseCase {
    colocaciones;
    constructor(colocaciones) {
        this.colocaciones = colocaciones;
    }
    async execute(input) {
        const existing = await this.colocaciones.findByCodigoSeguimiento(input.codigoSeguimiento);
        if (existing) {
            throw new app_error_1.ValidationError('Ya existe una colocacion con ese codigo de seguimiento');
        }
        const elemento = await this.colocaciones.findElementoById(input.idElemento);
        if (!elemento) {
            throw new app_error_1.NotFoundError('Elemento no encontrado');
        }
        if (!elemento.activo || elemento.anulado) {
            throw new app_error_1.ValidationError('El elemento no esta disponible para colocaciones');
        }
        const version = await this.colocaciones.findVersionCampanaById(input.idVersionCampana);
        if (!version) {
            throw new app_error_1.NotFoundError('Version de campana no encontrada');
        }
        if (!version.activo || version.anulado) {
            throw new app_error_1.ValidationError('La version de campana no esta disponible');
        }
        const periodo = await this.colocaciones.findPeriodoById(input.idPeriodoColocacion);
        if (!periodo) {
            throw new app_error_1.NotFoundError('Periodo de colocacion no encontrado');
        }
        if (!periodo.activo) {
            throw new app_error_1.ValidationError('El periodo de colocacion no esta activo');
        }
        const created = await this.colocaciones.create({
            codigoSeguimiento: input.codigoSeguimiento,
            idElemento: input.idElemento,
            idVersionCampana: input.idVersionCampana,
            idPeriodoColocacion: input.idPeriodoColocacion,
            observaciones: input.observaciones,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateColocacionUseCase = CreateColocacionUseCase;
//# sourceMappingURL=create-colocacion.use-case.js.map