"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProveedorUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class UpdateProveedorUseCase {
    proveedores;
    provincias;
    municipios;
    sectores;
    constructor(proveedores, provincias, municipios, sectores) {
        this.proveedores = proveedores;
        this.provincias = provincias;
        this.municipios = municipios;
        this.sectores = sectores;
    }
    async execute(idProveedor, input) {
        const existing = await this.proveedores.findById(idProveedor);
        if (!existing) {
            throw new app_error_1.NotFoundError('Suplidor no encontrado');
        }
        const existingData = existing.toPrimitives();
        const nextRnc = input.rnc === undefined ? existingData.rnc : input.rnc?.trim() || null;
        const nextProvincia = input.idProvincia === undefined ? existingData.idProvincia : input.idProvincia;
        const nextMunicipio = input.idMunicipio === undefined ? existingData.idMunicipio : input.idMunicipio;
        const nextSector = input.idSectorBarrio === undefined ? existingData.idSectorBarrio : input.idSectorBarrio;
        if (nextRnc) {
            const existingByRnc = await this.proveedores.findByRnc(nextRnc);
            if (existingByRnc && existingByRnc.toPrimitives().idProveedor !== idProveedor) {
                throw new app_error_1.ConflictError('Ya existe un suplidor con ese RNC');
            }
        }
        if (nextProvincia) {
            const provincia = await this.provincias.findById(nextProvincia);
            if (!provincia) {
                throw new app_error_1.NotFoundError('Provincia no encontrada');
            }
        }
        if (nextMunicipio) {
            const municipio = await this.municipios.findById(nextMunicipio);
            if (!municipio) {
                throw new app_error_1.NotFoundError('Municipio no encontrado');
            }
            if (nextProvincia) {
                const municipioData = municipio.toPrimitives();
                if (municipioData.idProvincia !== nextProvincia) {
                    throw new app_error_1.ValidationError('El municipio no pertenece a la provincia seleccionada');
                }
            }
        }
        if (nextSector) {
            const sector = await this.sectores.findById(nextSector);
            if (!sector) {
                throw new app_error_1.NotFoundError('Sector no encontrado');
            }
            if (nextMunicipio) {
                const sectorData = sector.toPrimitives();
                if (sectorData.idMunicipio !== nextMunicipio) {
                    throw new app_error_1.ValidationError('El sector no pertenece al municipio seleccionado');
                }
            }
        }
        const updated = await this.proveedores.update(idProveedor, {
            proveedor: input.proveedor?.trim(),
            rnc: input.rnc === undefined ? undefined : input.rnc?.trim() || null,
            personaContacto: input.personaContacto === undefined
                ? undefined
                : input.personaContacto?.trim() || null,
            cargo: input.cargo === undefined ? undefined : input.cargo?.trim() || null,
            email: input.email === undefined ? undefined : input.email?.trim() || null,
            paginaWeb: input.paginaWeb === undefined ? undefined : input.paginaWeb?.trim() || null,
            direccion: input.direccion === undefined ? undefined : input.direccion?.trim() || null,
            idProvincia: input.idProvincia,
            idMunicipio: input.idMunicipio,
            idSectorBarrio: input.idSectorBarrio,
            activo: input.activo,
            actualizadoPor: input.actualizadoPor,
        });
        return updated.toPrimitives();
    }
}
exports.UpdateProveedorUseCase = UpdateProveedorUseCase;
//# sourceMappingURL=update-proveedor.use-case.js.map