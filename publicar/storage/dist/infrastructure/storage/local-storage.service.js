"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../../config/env");
class LocalStorageService {
    basePath;
    constructor(basePath = env_1.env.storagePath) {
        this.basePath = basePath;
    }
    getAbsolutePath(relativePath) {
        const normalized = path_1.default.normalize(relativePath).replace(/^(\.\.[/\\])+/, '');
        const absolute = path_1.default.resolve(this.basePath, normalized);
        const baseResolved = path_1.default.resolve(this.basePath);
        if (!absolute.startsWith(baseResolved)) {
            throw new Error('Ruta de almacenamiento inválida');
        }
        return absolute;
    }
    async ensureDirectory(relativePath) {
        const dir = path_1.default.dirname(this.getAbsolutePath(relativePath));
        await promises_1.default.mkdir(dir, { recursive: true });
    }
    async save(buffer, relativePath) {
        await this.ensureDirectory(relativePath);
        const absolutePath = this.getAbsolutePath(relativePath);
        await promises_1.default.writeFile(absolutePath, buffer);
        return relativePath;
    }
    async read(relativePath) {
        const absolutePath = this.getAbsolutePath(relativePath);
        return promises_1.default.readFile(absolutePath);
    }
    async delete(relativePath) {
        const absolutePath = this.getAbsolutePath(relativePath);
        try {
            await promises_1.default.unlink(absolutePath);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    async exists(relativePath) {
        try {
            await promises_1.default.access(this.getAbsolutePath(relativePath));
            return true;
        }
        catch {
            return false;
        }
    }
    async isStorageHealthy() {
        try {
            await promises_1.default.mkdir(this.basePath, { recursive: true });
            await promises_1.default.access(this.basePath);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=local-storage.service.js.map