import multer from 'multer';

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

export const imageUploadMiddleware = multer({
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
