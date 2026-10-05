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
exports.ImportCategoriasAnunciantesExcelService = void 0;
const XLSX = __importStar(require("xlsx"));
const app_error_1 = require("../../../../core/errors/app-error");
const create_categoria_anunciante_use_case_1 = require("../use-cases/create-categoria-anunciante.use-case");
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
class ImportCategoriasAnunciantesExcelService {
    categoriaRepository;
    sectorRepository;
    subSectorRepository;
    constructor(categoriaRepository, sectorRepository, subSectorRepository) {
        this.categoriaRepository = categoriaRepository;
        this.sectorRepository = sectorRepository;
        this.subSectorRepository = subSectorRepository;
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
        const createCategoria = new create_categoria_anunciante_use_case_1.CreateCategoriaAnuncianteUseCase(this.categoriaRepository, this.sectorRepository, this.subSectorRepository);
        const sectores = (await this.sectorRepository.findMany()).map((item) => item.toPrimitives());
        const subSectores = (await this.subSectorRepository.findMany()).map((item) => item.toPrimitives());
        let importedCount = 0;
        let skippedCount = 0;
        const duplicates = [];
        for (const row of rows) {
            const sectorName = normalizeText(findRowValue(row, ['sectorindustrial', 'sector', 'nombresectorindustrial'], {
                allowContains: true,
            }));
            const subSectorName = normalizeText(findRowValue(row, ['subsectorindustrial', 'subsector', 'nombresubsectorindustrial'], {
                allowContains: true,
            }));
            const categoriaName = normalizeText(findRowValue(row, ['categoriaanunciante', 'categoria', 'categoriaanunciante', 'nombre']));
            if (!categoriaName || !hasAlphabeticCharacter(categoriaName)) {
                skippedCount += 1;
                continue;
            }
            let idSectorIndustrial = parseInteger(findRowValue(row, ['idsectorindustrial']));
            if (!idSectorIndustrial && sectorName) {
                const matching = sectores.find((item) => normalizeText(item.sectorIndustrial).toLowerCase() === sectorName.toLowerCase());
                if (matching) {
                    idSectorIndustrial = matching.idSectorIndustrial;
                }
            }
            let idSubSectorIndustrial = parseInteger(findRowValue(row, ['idsubsectorindustrial']));
            if (!idSubSectorIndustrial && subSectorName) {
                const matching = subSectores.find((item) => {
                    if (normalizeText(item.subSectorIndustrial).toLowerCase() !== subSectorName.toLowerCase()) {
                        return false;
                    }
                    if (!idSectorIndustrial) {
                        return true;
                    }
                    return item.idSectorIndustrial === idSectorIndustrial;
                });
                if (matching) {
                    idSubSectorIndustrial = matching.idSubSectorIndustrial;
                }
            }
            if (!idSectorIndustrial || !idSubSectorIndustrial) {
                skippedCount += 1;
                continue;
            }
            const existing = await this.categoriaRepository.findByNombreInSubSector(idSubSectorIndustrial, categoriaName);
            if (existing) {
                skippedCount += 1;
                duplicates.push(`${categoriaName} (${subSectorName || idSubSectorIndustrial})`);
                continue;
            }
            await createCategoria.execute({
                idSectorIndustrial,
                idSubSectorIndustrial,
                categoriaAnunciante: categoriaName,
                creadoPor,
            });
            importedCount += 1;
        }
        if (importedCount === 0 && skippedCount === 0) {
            throw new app_error_1.ValidationError(`No se encontraron categorías validas en el archivo ${fileName}`);
        }
        return {
            importedCount,
            skippedCount,
            duplicates,
        };
    }
}
exports.ImportCategoriasAnunciantesExcelService = ImportCategoriasAnunciantesExcelService;
//# sourceMappingURL=import-categorias-anunciantes-excel.service.js.map