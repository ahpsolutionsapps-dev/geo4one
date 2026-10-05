"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const IMAGE_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const storage = multer_1.default.memoryStorage();
exports.imageUploadMiddleware = (0, multer_1.default)({
    storage,
    limits: { fileSize: MAX_IMAGE_SIZE },
    fileFilter: (_req, file, cb) => {
        if (!file.originalname) {
            cb(new Error('Nombre de archivo requerido'));
            return;
        }
        if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
            cb(new Error('Solo se permiten imágenes JPG, PNG, GIF o WebP'));
            return;
        }
        cb(null, true);
    },
}).single('imagen');
//# sourceMappingURL=image-upload.middleware.js.map