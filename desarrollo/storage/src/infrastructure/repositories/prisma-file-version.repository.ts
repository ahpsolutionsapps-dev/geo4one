import { FileVersionEntity } from '../../domain/entities';
import { FileVersionRepository } from '../../domain/repositories';
import { mapFileVersion } from '../database/mappers';
import { prisma } from '../database/prisma.client';

export class PrismaFileVersionRepository implements FileVersionRepository {
  async create(
    data: Omit<FileVersionEntity, 'createdAt'>,
  ): Promise<FileVersionEntity> {
    const record = await prisma.fileVersion.create({ data });
    return mapFileVersion(record);
  }

  async listByFileId(fileId: string): Promise<FileVersionEntity[]> {
    const records = await prisma.fileVersion.findMany({
      where: { fileId },
      orderBy: { versionNumber: 'desc' },
    });
    return records.map(mapFileVersion);
  }

  async getLatestVersionNumber(fileId: string): Promise<number> {
    const latest = await prisma.fileVersion.findFirst({
      where: { fileId },
      orderBy: { versionNumber: 'desc' },
    });
    return latest?.versionNumber ?? 0;
  }
}
