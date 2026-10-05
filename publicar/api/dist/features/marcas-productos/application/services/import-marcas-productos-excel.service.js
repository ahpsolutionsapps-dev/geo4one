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
exports.ImportMarcasProductosExcelService = void 0;
const XLSX = __importStar(require("xlsx"));
const app_error_1 = require("../../../../core/errors/app-error");
const create_marca_producto_use_case_1 = require("../use-cases/create-marca-producto.use-case");
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
const parseInteger = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const normalized = String(value).trim();
    if (!normalized) {
        return null;
    }
    const numeric = Number(normalized);
    if (!Number.isInteger(numeric) || numeric <= 0) {
        return null;
    }
    return numeric;
};
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
class ImportMarcasProductosExcelService {
    repository;
    constructor(repository) {
        this.repository = repository;
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
        const createMarca = new create_marca_producto_use_case_1.CreateMarcaProductoUseCase(this.repository);
        const existingItems = await this.repository.findMany();
        let importedCount = 0;
        let skippedCount = 0;
        const duplicates = [];
        for (const row of rows) {
            const anuncianteName = normalizeText(findRowValue(row, ['anunciante', 'nombreanunciante'], { allowContains: true }));
            const categoriaName = normalizeText(findRowValue(row, ['categoriaanunciante', 'categoria'], { allowContains: true }));
            const marcaName = normalizeText(findRowValue(row, ['marcaproducto', 'marca', 'producto', 'nombre'], { allowContains: true }));
            if (!marcaName || !hasAlphabeticCharacter(marcaName)) {
                skippedCount += 1;
                continue;
            }
            let idAnunciante = parseInteger(findRowValue(row, ['idanunciante']));
            let idCategoriaAnunciante = parseInteger(findRowValue(row, ['idcategoriaanunciante']));
            if (!idAnunciante && anuncianteName) {
                const match = existingItems.find((item) => {
                    const anuncio = item.toPrimitives();
                    if (normalizeText(anuncio.anunciante).toLowerCase() !== anuncianteName.toLowerCase()) {
                        return false;
                    }
                    if (idCategoriaAnunciante && anuncio.idCategoriaAnunciante !== idCategoriaAnunciante) {
                        return false;
                    }
                    return true;
                });
                if (match) {
                    idAnunciante = match.toPrimitives().idAnunciante;
                }
            }
            if (!idCategoriaAnunciante && categoriaName) {
                const match = existingItems.find((item) => {
                    const anuncio = item.toPrimitives();
                    return normalizeText(anuncio.categoriaAnunciante).toLowerCase() === categoriaName.toLowerCase();
                });
                if (match) {
                    idCategoriaAnunciante = match.toPrimitives().idCategoriaAnunciante;
                }
            }
            if (!idAnunciante || !idCategoriaAnunciante) {
                skippedCount += 1;
                continue;
            }
            const existing = await this.repository.findByNombreInAnunciante(idAnunciante, marcaName);
            if (existing) {
                skippedCount += 1;
                duplicates.push(`${marcaName} (${anuncianteName || idAnunciante})`);
                continue;
            }
            await createMarca.execute({
                idAnunciante,
                idCategoriaAnunciante,
                marcaProducto: marcaName,
                creadoPor,
            });
            importedCount += 1;
        }
        if (importedCount === 0 && skippedCount === 0) {
            throw new app_error_1.ValidationError(`No se encontraron marcas validas en el archivo ${fileName}`);
        }
        return {
            importedCount,
            skippedCount,
            duplicates,
        };
    }
}
exports.ImportMarcasProductosExcelService = ImportMarcasProductosExcelService;
//# sourceMappingURL=import-marcas-productos-excel.service.js.map