"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportProveedoresExcelService = void 0;
const XLSX = __importStar(require("xlsx"));
const app_error_1 = require("../../../../core/errors/app-error");
const create_proveedor_use_case_1 = require("../use-cases/create-proveedor.use-case");
const normalizeText = (value) => {
    if (typeof value !== 'string') {
        return '';
    }
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};
const normalizeKey = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
const hasAlphabeticCharacter = (value) => /[a-z]/i.test(value);
const findRowValue = (row, candidates, options) => {
    const allowContains = options?.allowContains ?? false;
    for (const key of Object.keys(row)) {
        const normalizedKey = normalizeKey(key);
        const matchesColumn = candidates.some((candidate) => {
            const normalizedCandidate = normalizeKey(candidate);
            if (normalizedKey === normalizedCandidate) {
                return true;
            }
            if (!allowContains) {
                return false;
            }
            return (normalizedKey.includes(normalizedCandidate) ||
                normalizedCandidate.includes(normalizedKey));
        });
        if (matchesColumn) {
            const value = row[key];
            return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
        }
    }
    return '';
};
const parseInteger = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const numeric = Number(String(value).trim());
    if (!Number.isInteger(numeric) || numeric <= 0) {
        return null;
    }
    return numeric;
};
const normalizeCompare = (value) => normalizeText(value).toLowerCase();
class ImportProveedoresExcelService {
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
    async execute(buffer, fileName, creadoPor) {
        if (!buffer || buffer.length === 0) {
            throw new app_error_1.ValidationError('El archivo Excel esta vacio');
        }
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            throw new app_error_1.ValidationError('El archivo Excel no tiene hojas');
        }
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, {
            defval: '',
            raw: false,
        });
        if (!rows.length) {
            throw new app_error_1.ValidationError('El archivo Excel no tiene filas para importar');
        }
        const createProveedor = new create_proveedor_use_case_1.CreateProveedorUseCase(this.proveedores, this.provincias, this.municipios, this.sectores);
        const existingProveedores = await this.proveedores.findMany();
        const existingNames = new Set(existingProveedores.map((item) => normalizeCompare(item.toPrimitives().proveedor)));
        let importedCount = 0;
        let skippedCount = 0;
        const duplicates = [];
        for (const row of rows) {
            const proveedorName = normalizeText(findRowValue(row, ['proveedor', 'suplidor', 'nombreproveedor', 'nombresuplidor', 'nombre']));
            if (!proveedorName || !hasAlphabeticCharacter(proveedorName)) {
                skippedCount += 1;
                continue;
            }
            const proveedorKey = normalizeCompare(proveedorName);
            if (existingNames.has(proveedorKey)) {
                skippedCount += 1;
                duplicates.push(proveedorName);
                continue;
            }
            const rnc = normalizeText(findRowValue(row, ['rnc'])) || null;
            if (rnc) {
                const existingByRnc = await this.proveedores.findByRnc(rnc);
                if (existingByRnc) {
                    skippedCount += 1;
                    duplicates.push(`${proveedorName} (RNC duplicado)`);
                    continue;
                }
            }
            const idProvinciaRaw = findRowValue(row, ['idprovincia']);
            const provinciaName = normalizeText(findRowValue(row, ['provincia', 'nombreprovincia', 'provincia_name']));
            let idProvincia = parseInteger(idProvinciaRaw);
            if (!idProvincia && provinciaName) {
                const provincia = await this.provincias.findByNombre(provinciaName);
                idProvincia = provincia ? provincia.toPrimitives().idProvincia : null;
            }
            const idMunicipioRaw = findRowValue(row, ['idmunicipio']);
            const municipioName = normalizeText(findRowValue(row, ['municipio', 'nombremunicipio', 'municipio_name']));
            let idMunicipio = parseInteger(idMunicipioRaw);
            if (!idMunicipio && municipioName) {
                const municipios = await this.municipios.findMany();
                const candidatos = municipios
                    .map((item) => item.toPrimitives())
                    .filter((item) => {
                    if (normalizeCompare(item.municipio) !== normalizeCompare(municipioName)) {
                        return false;
                    }
                    if (!idProvincia) {
                        return true;
                    }
                    return item.idProvincia === idProvincia;
                });
                if (candidatos.length === 1) {
                    idMunicipio = candidatos[0].idMunicipio;
                }
            }
            const idSectorBarrioRaw = findRowValue(row, ['idsectorbarrio', 'idsector']);
            const sectorName = normalizeText(findRowValue(row, ['sectorbarrio', 'sector', 'barrio', 'nombresector']));
            let idSectorBarrio = parseInteger(idSectorBarrioRaw);
            if (!idSectorBarrio && sectorName && idMunicipio) {
                const sector = await this.sectores.findByNombreInMunicipio(idMunicipio, sectorName);
                idSectorBarrio = sector ? sector.toPrimitives().idSectorBarrio : null;
            }
            await createProveedor.execute({
                proveedor: proveedorName,
                rnc,
                personaContacto: normalizeText(findRowValue(row, ['personacontacto', 'contacto', 'responsable'])) || null,
                cargo: normalizeText(findRowValue(row, ['cargo'])) || null,
                email: normalizeText(findRowValue(row, ['email', 'correo'])) || null,
                paginaWeb: normalizeText(findRowValue(row, ['paginaweb', 'web', 'sitio'])) || null,
                direccion: normalizeText(findRowValue(row, ['direccion', 'direccionfiscal'])) || null,
                idProvincia,
                idMunicipio,
                idSectorBarrio,
                creadoPor,
            });
            existingNames.add(proveedorKey);
            importedCount += 1;
        }
        if (importedCount === 0 && skippedCount === 0) {
            throw new app_error_1.ValidationError(`No se encontraron suplidores validos en el archivo ${fileName}`);
        }
        return {
            importedCount,
            skippedCount,
            duplicates,
        };
    }
}
exports.ImportProveedoresExcelService = ImportProveedoresExcelService;
//# sourceMappingURL=import-proveedores-excel.service.js.map