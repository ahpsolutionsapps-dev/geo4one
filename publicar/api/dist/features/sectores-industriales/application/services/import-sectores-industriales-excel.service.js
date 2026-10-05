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
exports.ImportSectoresIndustrialesExcelService = void 0;
const XLSX = __importStar(require("xlsx"));
const app_error_1 = require("../../../../core/errors/app-error");
const create_sector_industrial_use_case_1 = require("../use-cases/create-sector-industrial.use-case");
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
class ImportSectoresIndustrialesExcelService {
    sectoresIndustriales;
    constructor(sectoresIndustriales) {
        this.sectoresIndustriales = sectoresIndustriales;
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
        const createSectorIndustrial = new create_sector_industrial_use_case_1.CreateSectorIndustrialUseCase(this.sectoresIndustriales);
        let importedCount = 0;
        let skippedCount = 0;
        const duplicates = [];
        for (const row of rows) {
            const sectorIndustrialName = normalizeText(findRowValue(row, ['sectorindustrial', 'sector', 'nombresectorindustrial', 'nombre']));
            if (!sectorIndustrialName || !hasAlphabeticCharacter(sectorIndustrialName)) {
                skippedCount += 1;
                continue;
            }
            const existing = await this.sectoresIndustriales.findByNombre(sectorIndustrialName);
            if (existing) {
                skippedCount += 1;
                duplicates.push(sectorIndustrialName);
                continue;
            }
            await createSectorIndustrial.execute({
                sectorIndustrial: sectorIndustrialName,
                creadoPor,
            });
            importedCount += 1;
        }
        if (importedCount === 0 && skippedCount === 0) {
            throw new app_error_1.ValidationError(`No se encontraron sectores industriales validos en el archivo ${fileName}`);
        }
        return {
            importedCount,
            skippedCount,
            duplicates,
        };
    }
}
exports.ImportSectoresIndustrialesExcelService = ImportSectoresIndustrialesExcelService;
//# sourceMappingURL=import-sectores-industriales-excel.service.js.map