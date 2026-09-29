import multer from 'multer';
import { env } from '../../config/env';

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: env.maxFileSize },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname) {
      cb(new Error('Nombre de archivo requerido'));
      return;
    }
    cb(null, true);
  },
}).single('file');

export const versionUploadMiddleware = multer({
  storage,
  limits: { fileSize: env.maxFileSize },
}).single('file');
