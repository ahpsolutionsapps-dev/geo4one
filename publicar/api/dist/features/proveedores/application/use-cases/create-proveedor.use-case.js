"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProveedorUseCase = void 0;
const app_error_1 = require("../../../../core/errors/app-error");
class CreateProveedorUseCase {
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
    async execute(input) {
        const proveedor = input.proveedor.trim();
        const rnc = input.rnc?.trim() ? input.rnc.trim() : null;
        if (rnc) {
            const existingByRnc = await this.proveedores.findByRnc(rnc);
            if (existingByRnc) {
                throw new app_error_1.ConflictError('Ya existe un suplidor con ese RNC');
            }
        }
        if (input.idProvincia) {
            const provincia = await this.provincias.findById(input.idProvincia);
            if (!provincia) {
                throw new app_error_1.NotFoundError('Provincia no encontrada');
            }
        }
        if (input.idMunicipio) {
            const municipio = await this.municipios.findById(input.idMunicipio);
            if (!municipio) {
                throw new app_error_1.NotFoundError('Municipio no encontrado');
            }
            if (input.idProvincia) {
                const municipioData = municipio.toPrimitives();
                if (municipioData.idProvincia !== input.idProvincia) {
                    throw new app_error_1.ValidationError('El municipio no pertenece a la provincia seleccionada');
                }
            }
        }
        if (input.idSectorBarrio) {
            const sector = await this.sectores.findById(input.idSectorBarrio);
            if (!sector) {
                throw new app_error_1.NotFoundError('Sector no encontrado');
            }
            if (input.idMunicipio) {
                const sectorData = sector.toPrimitives();
                if (sectorData.idMunicipio !== input.idMunicipio) {
                    throw new app_error_1.ValidationError('El sector no pertenece al municipio seleccionado');
                }
            }
        }
        const created = await this.proveedores.create({
            proveedor,
            rnc,
            personaContacto: input.personaContacto?.trim() ? input.personaContacto.trim() : null,
            cargo: input.cargo?.trim() ? input.cargo.trim() : null,
            email: input.email?.trim() ? input.email.trim() : null,
            paginaWeb: input.paginaWeb?.trim() ? input.paginaWeb.trim() : null,
            direccion: input.direccion?.trim() ? input.direccion.trim() : null,
            idProvincia: input.idProvincia ?? null,
            idMunicipio: input.idMunicipio ?? null,
            idSectorBarrio: input.idSectorBarrio ?? null,
            creadoPor: input.creadoPor,
        });
        return created.toPrimitives();
    }
}
exports.CreateProveedorUseCase = CreateProveedorUseCase;
//# sourceMappingURL=create-proveedor.use-case.js.map