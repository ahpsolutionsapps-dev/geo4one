import { Request, Response } from 'express';
import { env } from '../../config/env';
import { container } from '../../config/container';
import {
  assignCategoriesSchema,
  assignTagsSchema,
  createApiKeySchema,
  fileIdParamSchema,
  generateReportPdfSchema,
  listFilesQuerySchema,
  updateApiKeySchema,
} from '../../application/validators';
import { normalizePagination } from '../../shared/helpers';
import { isFail } from '../../shared/types/result';
import { asyncHandler } from '../middlewares/error.middleware';

function mapFileMetadata(file: Awaited<ReturnType<typeof container.useCases.getFileById.execute>>) {
  return {
    id: file.id,
    fileName: file.fileName,
    originalFileName: file.originalFileName,
    extension: file.extension,
    mimeType: file.mimeType,
    fileSize: file.fileSize,
    hash: file.hash,
    downloadUrl: `${env.publicUrl}/api/files/download/${file.id}`,
    createdAt: file.createdAt.toISOString(),
    updatedAt: file.updatedAt?.toISOString() ?? null,
    deletedAt: file.deletedAt?.toISOString() ?? null,
  };
}

export class ReportsController {
  generatePdf = asyncHandler(async (req: Request, res: Response) => {
    const body = generateReportPdfSchema.parse(req.body);
    const result = await container.useCases.generateReportPdf.execute({
      title: body.title,
      headers: body.headers,
      rows: body.rows,
      fileName: body.fileName,
      apiKeyId: req.apiKey?.id,
      ipAddress: req.ip,
    });

    if (isFail(result)) {
      throw result.error;
    }

    res.status(201).json({
      success: true,
      message: 'Reporte PDF generado correctamente',
      data: {
        ...result.value,
        downloadUrl: `${env.publicUrl}${result.value.url}`,
      },
    });
  });
}

export class FilesController {
  upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(422).json({ success: false, message: 'Archivo requerido en campo "file"' });
      return;
    }

    const result = await container.useCases.uploadFile.execute({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      apiKeyId: req.apiKey?.id,
      ipAddress: req.ip,
    });

    if (isFail(result)) {
      throw result.error;
    }

    res.status(201).json({
      success: true,
      message: 'Archivo cargado correctamente',
      data: {
        ...result.value,
        url: `${env.publicUrl}${result.value.url}`,
      },
    });
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const query = listFilesQuerySchema.parse(req.query);
    const pagination = normalizePagination(query.page, query.limit);
    const result = await container.useCases.getFiles.execute(
      {
        fileName: query.fileName,
        mimeType: query.mimeType,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        category: query.category,
        tag: query.tag,
      },
      pagination,
    );

    res.json({
      success: true,
      message: 'Listado obtenido correctamente',
      data: {
        ...result,
        items: result.items.map(mapFileMetadata),
      },
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    const file = await container.useCases.getFileById.execute(id);
    res.json({
      success: true,
      message: 'Metadata obtenida correctamente',
      data: mapFileMetadata(file),
    });
  });

  download = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    const { file, buffer } = await container.useCases.downloadFile.execute({
      id,
      apiKeyId: req.apiKey?.id,
      ipAddress: req.ip,
    });

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.originalFileName)}"`,
    );
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    await container.useCases.deleteFile.execute({
      id,
      apiKeyId: req.apiKey?.id,
      ipAddress: req.ip,
    });
    res.json({ success: true, message: 'Archivo eliminado correctamente' });
  });

  restore = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    await container.useCases.restoreFile.execute({
      id,
      apiKeyId: req.apiKey?.id,
      ipAddress: req.ip,
    });
    res.json({ success: true, message: 'Archivo restaurado correctamente' });
  });

  assignCategories = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    const body = assignCategoriesSchema.parse(req.body);
    await container.useCases.assignCategories.execute({
      fileId: id,
      categories: body.categories,
      apiKeyId: req.apiKey?.id,
      ipAddress: req.ip,
    });
    res.json({ success: true, message: 'Categorías asignadas correctamente' });
  });

  assignTags = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    const body = assignTagsSchema.parse(req.body);
    await container.useCases.assignTags.execute({
      fileId: id,
      tags: body.tags,
      apiKeyId: req.apiKey?.id,
      ipAddress: req.ip,
    });
    res.json({ success: true, message: 'Etiquetas asignadas correctamente' });
  });

  createVersion = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    if (!req.file) {
      res.status(422).json({ success: false, message: 'Archivo requerido en campo "file"' });
      return;
    }

    const version = await container.useCases.createFileVersion.execute({
      fileId: id,
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      apiKeyId: req.apiKey?.id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Versión creada correctamente',
      data: {
        id: version.id,
        fileId: version.fileId,
        versionNumber: version.versionNumber,
        fileSize: version.fileSize,
        createdAt: version.createdAt.toISOString(),
      },
    });
  });

  listVersions = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    const versions = await container.useCases.getFileVersions.execute(id);
    res.json({
      success: true,
      message: 'Versiones obtenidas correctamente',
      data: versions.map((v) => ({
        id: v.id,
        fileId: v.fileId,
        versionNumber: v.versionNumber,
        fileSize: v.fileSize,
        createdAt: v.createdAt.toISOString(),
      })),
    });
  });

  createSignedUrl = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    const signed = await container.useCases.createSignedUrl.execute(id);
    res.json({
      success: true,
      message: 'URL firmada generada correctamente',
      data: {
        url: signed.url,
        expiresAt: signed.expiresAt.toISOString(),
      },
    });
  });

  downloadSigned = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    const { file, buffer } = await container.useCases.downloadBySignedUrl.execute(token);

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.originalFileName)}"`,
    );
    res.send(buffer);
  });

  metrics = asyncHandler(async (_req: Request, res: Response) => {
    const metrics = await container.useCases.getMetrics.execute();
    res.json({ success: true, message: 'Métricas obtenidas', data: metrics });
  });
}

export class AdminController {
  createApiKey = asyncHandler(async (req: Request, res: Response) => {
    const body = createApiKeySchema.parse(req.body);
    const apiKey = await container.useCases.createApiKey.execute(body.name);
    res.status(201).json({
      success: true,
      message: 'API Key creada correctamente',
      data: {
        id: apiKey.id,
        name: apiKey.name,
        apiKey: apiKey.apiKey,
        isActive: apiKey.isActive,
        createdAt: apiKey.createdAt.toISOString(),
        lastUsedAt: apiKey.lastUsedAt?.toISOString() ?? null,
      },
    });
  });

  listApiKeys = asyncHandler(async (_req: Request, res: Response) => {
    const keys = await container.useCases.listApiKeys.execute();
    res.json({
      success: true,
      message: 'API Keys obtenidas correctamente',
      data: keys.map((k) => ({
        id: k.id,
        name: k.name,
        isActive: k.isActive,
        createdAt: k.createdAt.toISOString(),
        lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
      })),
    });
  });

  updateApiKey = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    const body = updateApiKeySchema.parse(req.body);
    const updated = await container.useCases.updateApiKeyStatus.execute(id, body.isActive);
    res.json({
      success: true,
      message: 'API Key actualizada correctamente',
      data: {
        id: updated.id,
        name: updated.name,
        isActive: updated.isActive,
        createdAt: updated.createdAt.toISOString(),
        lastUsedAt: updated.lastUsedAt?.toISOString() ?? null,
      },
    });
  });

  deleteApiKey = asyncHandler(async (req: Request, res: Response) => {
    const { id } = fileIdParamSchema.parse(req.params);
    await container.useCases.deleteApiKey.execute(id);
    res.json({ success: true, message: 'API Key eliminada correctamente' });
  });
}

export const filesController = new FilesController();
export const adminController = new AdminController();
export const reportsController = new ReportsController();
