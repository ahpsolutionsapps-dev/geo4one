import { PaginationParams, PaginatedResult } from '../../shared/types';
import { FileEntity } from '../../domain/entities';
import {
  CreateFileData,
  FileListFilters,
  FileRepository,
} from '../../domain/repositories';
import { mapFile } from '../database/mappers';
import { prisma } from '../database/prisma.client';

export class PrismaFileRepository implements FileRepository {
  async create(data: CreateFileData): Promise<FileEntity> {
    const record = await prisma.file.create({
      data: {
        id: data.id,
        fileName: data.fileName,
        originalFileName: data.originalFileName,
        extension: data.extension,
        mimeType: data.mimeType,
        fileSize: BigInt(data.fileSize),
        storagePath: data.storagePath,
        hash: data.hash,
      },
    });
    return mapFile(record);
  }

  async findById(id: string, includeDeleted = false): Promise<FileEntity | null> {
    const record = await prisma.file.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });
    return record ? mapFile(record) : null;
  }

  async findByHash(hash: string): Promise<FileEntity | null> {
    const record = await prisma.file.findFirst({
      where: { hash, deletedAt: null },
    });
    return record ? mapFile(record) : null;
  }

  async list(
    filters: FileListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<FileEntity>> {
    const where: Record<string, unknown> = {
      ...(filters.includeDeleted ? {} : { deletedAt: null }),
    };

    if (filters.fileName) {
      where.OR = [
        { fileName: { contains: filters.fileName } },
        { originalFileName: { contains: filters.fileName } },
      ];
    }

    if (filters.mimeType) {
      where.mimeType = { contains: filters.mimeType };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {
        ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
        ...(filters.dateTo ? { lte: filters.dateTo } : {}),
      };
    }

    if (filters.category) {
      where.categories = {
        some: {
          category: {
            name: { equals: filters.category },
          },
        },
      };
    }

    if (filters.tag) {
      where.tags = {
        some: {
          tag: {
            name: { equals: filters.tag },
          },
        },
      };
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [records, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.file.count({ where }),
    ]);

    return {
      items: records.map(mapFile),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.max(1, Math.ceil(total / pagination.limit)),
    };
  }

  async softDelete(id: string): Promise<void> {
    await prisma.file.update({
      where: { id },
      data: { deletedAt: new Date(), updatedAt: new Date() },
    });
  }

  async restore(id: string): Promise<void> {
    await prisma.file.update({
      where: { id },
      data: { deletedAt: null, updatedAt: new Date() },
    });
  }

  async hardDelete(id: string): Promise<void> {
    await prisma.file.delete({ where: { id } });
  }
}
