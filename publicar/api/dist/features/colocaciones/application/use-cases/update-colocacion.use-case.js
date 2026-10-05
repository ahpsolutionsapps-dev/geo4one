"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateColocacionUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateColocacionUseCase {
    colocaciones;
    constructor(colocaciones) {
        this.colocaciones = colocaciones;
    }
    async execute(idColocacion, input) {
        const existing = await this.colocaciones.findById(idColocacion);
        if (!existing) {
            throw new app_error_1.NotFoundError('Colocacion no encontrada');
        }
        const current = existing.toPrimitives();
        const nextCodigo = input.codigoSeguimiento ?? current.codigoSeguimiento;
        const nextElemento = input.idElemento ?? current.idElemento;
        const nextVersion = input.idVersionCampana ?? current.idVersionCampana;
        const nextPeriodo = input.idPeriodoColocacion ?? current.idPeriodoColocacion;
        const duplicated = await this.colocaciones.findByCodigoSeguimiento(nextCodigo);
        if (duplicated && duplicated.toPrimitives().idColocacion !== idColocacion) {
            throw new app_error_1.ValidationError('Ya existe una colocacion con ese codigo de seguimiento');
        }
        const elemento = await this.colocaciones.findElementoById(nextElemento);
        if (!elemento) {
            throw new app_error_1.NotFoundError('Elemento no encontrado');
        }
        if (!elemento.activo || elemento.anulado) {
            throw new app_error_1.ValidationError('El elemento no esta disponible para colocaciones');
        }
        const version = await this.colocaciones.findVersionCampanaById(nextVersion);
        if (!version) {
            throw new app_error_1.NotFoundError('Version de campana no encontrada');
        }
        if (!version.activo || version.anulado) {
            throw new app_error_1.ValidationError('La version de campana no esta disponible');
        }
        const periodo = await this.colocaciones.findPeriodoById(nextPeriodo);
        if (!periodo) {
            throw new app_error_1.NotFoundError('Periodo de colocacion no encontrado');
        }
        if (!periodo.activo) {
            throw new app_error_1.ValidationError('El periodo de colocacion no esta activo');
        }
        const updated = await this.colocaciones.update(idColocacion, {
            codigoSeguimiento: input.codigoSeguimiento,
            idElemento: input.idElemento,
            idVersionCampana: input.idVersionCampana,
            idPeriodoColocacion: input.idPeriodoColocacion,
            observaciones: input.observaciones,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateColocacionUseCase = UpdateColocacionUseCase;
//# sourceMappingURL=update-colocacion.use-case.js.map