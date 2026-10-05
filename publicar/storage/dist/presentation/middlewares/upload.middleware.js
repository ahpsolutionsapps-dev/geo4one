"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionUploadMiddleware = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const env_1 = require("../../config/env");
const storage = multer_1.default.memoryStorage();
exports.uploadMiddleware = (0, multer_1.default)({
    storage,
    limits: { fileSize: env_1.env.maxFileSize },
    fileFilter: (_req, file, cb) => {
        if (!file.originalname) {
            cb(new Error('Nombre de archivo requerido'));
            return;
        }
        cb(null, true);
    },
}).single('file');
exports.versionUploadMiddleware = (0, multer_1.default)({
    storage,
    limits: { fileSize: env_1.env.maxFileSize },
}).single('file');
//# sourceMappingURL=upload.middleware.js.map