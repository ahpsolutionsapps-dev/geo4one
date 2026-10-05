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
exports.ImportSubSectoresIndustrialesExcelService = void 0;
const XLSX = __importStar(require("xlsx"));
const app_error_1 = require("../../../../core/errors/app-error");
const create_sub_sector_industrial_use_case_1 = require("../use-cases/create-sub-sector-industrial.use-case");
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
class ImportSubSectoresIndustrialesExcelService {
    subSectoresIndustriales;
    sectoresIndustriales;
    constructor(subSectoresIndustriales, sectoresIndustriales) {
        this.subSectoresIndustriales = subSectoresIndustriales;
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
        const createSubSectorIndustrial = new create_sub_sector_industrial_use_case_1.CreateSubSectorIndustrialUseCase(this.subSectoresIndustriales, this.sectoresIndustriales);
        const sectors = (await this.sectoresIndustriales.findMany()).map((item) => item.toPrimitives());
        let importedCount = 0;
        let skippedCount = 0;
        const duplicates = [];
        for (const row of rows) {
            const sectorName = normalizeText(findRowValue(row, ['sectorindustrial', 'sector', 'nombresectorindustrial'], {
                allowContains: true,
            }));
            const subSectorName = normalizeText(findRowValue(row, ['subsectorindustrial', 'subsector', 'nombresubsectorindustrial', 'nombre']));
            if (!subSectorName || !hasAlphabeticCharacter(subSectorName)) {
                skippedCount += 1;
                continue;
            }
            let idSectorIndustrial = parseInteger(findRowValue(row, ['idsectorindustrial']));
            if (!idSectorIndustrial && sectorName) {
                const matchingSector = sectors.find((item) => {
                    return normalizeText(item.sectorIndustrial).toLowerCase() === sectorName.toLowerCase();
                });
                if (matchingSector) {
                    idSectorIndustrial = matchingSector.idSectorIndustrial;
                }
            }
            if (!idSectorIndustrial) {
                skippedCount += 1;
                continue;
            }
            const existing = await this.subSectoresIndustriales.findByNombreInSector(idSectorIndustrial, subSectorName);
            if (existing) {
                skippedCount += 1;
                duplicates.push(`${subSectorName} (${sectorName || idSectorIndustrial})`);
                continue;
            }
            await createSubSectorIndustrial.execute({
                idSectorIndustrial,
                subSectorIndustrial: subSectorName,
                creadoPor,
            });
            importedCount += 1;
        }
        if (importedCount === 0 && skippedCount === 0) {
            throw new app_error_1.ValidationError(`No se encontraron sub sectores industriales validos en el archivo ${fileName}`);
        }
        return {
            importedCount,
            skippedCount,
            duplicates,
        };
    }
}
exports.ImportSubSectoresIndustrialesExcelService = ImportSubSectoresIndustrialesExcelService;
//# sourceMappingURL=import-sub-sectores-industriales-excel.service.js.map