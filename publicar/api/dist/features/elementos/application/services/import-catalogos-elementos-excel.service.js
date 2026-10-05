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
exports.ImportCatalogosElementosExcelService = void 0;
const XLSX = __importStar(require("xlsx"));
const app_error_1 = require("../../../../core/errors/app-error");
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
class ImportCatalogosElementosExcelService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    readRows(buffer) {
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
        return rows;
    }
    async importSimple(kind, buffer, fileName, userId) {
        const rows = this.readRows(buffer);
        const map = {
            'tipos-elementos': {
                list: () => this.repository.findTiposElementosCatalogo(),
                create: (nombre) => this.repository.createTipoElementoCatalogo({ nombre, creadoPor: userId }),
            },
            orientaciones: {
                list: () => this.repository.findOrientacionesCatalogo(),
                create: (nombre) => this.repository.createOrientacionCatalogo({ nombre, creadoPor: userId }),
            },
            dimensiones: {
                list: () => this.repository.findDimensionesCatalogo(),
                create: (nombre) => this.repository.createDimensionCatalogo({ nombre, creadoPor: userId }),
            },
        }[kind];
        const existing = await map.list();
        const knownNames = new Set(existing.map((item) => normalizeCompare(item.nombre)));
        let importedCount = 0;
        let skippedCount = 0;
        const duplicates = [];
        for (const row of rows) {
            const nombre = normalizeText(findRowValue(row, ['nombre', 'tipo', 'valor', 'descripcion']));
            if (!nombre || !hasAlphabeticCharacter(nombre)) {
                skippedCount += 1;
                continue;
            }
            const key = normalizeCompare(nombre);
            if (knownNames.has(key)) {
                skippedCount += 1;
                duplicates.push(nombre);
                continue;
            }
            await map.create(nombre);
            knownNames.add(key);
            importedCount += 1;
        }
        if (importedCount === 0 && skippedCount === 0) {
            throw new app_error_1.ValidationError(`No se encontraron filas validas en el archivo ${fileName}`);
        }
        return {
            importedCount,
            skippedCount,
            duplicates,
        };
    }
    async importFormatos(buffer, fileName, userId) {
        const rows = this.readRows(buffer);
        const tiposElementos = await this.repository.findTiposElementosCatalogo();
        const tiposByName = new Map(tiposElementos.map((item) => [normalizeCompare(item.nombre), item.id]));
        const formatos = await this.repository.findFormatosCatalogo();
        const formatKeys = new Set(formatos.map((item) => `${item.idTipoElemento}:${normalizeCompare(item.nombre)}`));
        let importedCount = 0;
        let skippedCount = 0;
        const duplicates = [];
        for (const row of rows) {
            const formato = normalizeText(findRowValue(row, ['formato', 'nombre', 'tipoformato']));
            if (!formato || !hasAlphabeticCharacter(formato)) {
                skippedCount += 1;
                continue;
            }
            const idTipoElementoRaw = findRowValue(row, ['idtipoelemento']);
            const tipoElementoName = normalizeText(findRowValue(row, ['tipoelemento', 'nombretipoelemento', 'tipo']));
            let idTipoElemento = parseInteger(idTipoElementoRaw);
            if (!idTipoElemento && tipoElementoName) {
                idTipoElemento = tiposByName.get(normalizeCompare(tipoElementoName)) ?? null;
            }
            if (!idTipoElemento) {
                skippedCount += 1;
                continue;
            }
            const duplicateKey = `${idTipoElemento}:${normalizeCompare(formato)}`;
            if (formatKeys.has(duplicateKey)) {
                skippedCount += 1;
                duplicates.push(formato);
                continue;
            }
            await this.repository.createFormatoCatalogo({
                idTipoElemento,
                formato,
                creadoPor: userId,
            });
            formatKeys.add(duplicateKey);
            importedCount += 1;
        }
        if (importedCount === 0 && skippedCount === 0) {
            throw new app_error_1.ValidationError(`No se encontraron filas validas en el archivo ${fileName}`);
        }
        return {
            importedCount,
            skippedCount,
            duplicates,
        };
    }
}
exports.ImportCatalogosElementosExcelService = ImportCatalogosElementosExcelService;
//# sourceMappingURL=import-catalogos-elementos-excel.service.js.map