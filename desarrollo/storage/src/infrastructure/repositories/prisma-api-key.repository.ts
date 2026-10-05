import { ApiKeyEntity } from '../../domain/entities';
import { ApiKeyRepository } from '../../domain/repositories';
import { mapApiKey } from '../database/mappers';
import { prisma } from '../database/prisma.client';

export class PrismaApiKeyRepository implements ApiKeyRepository {
  async create(
    data: Omit<ApiKeyEntity, 'createdAt' | 'lastUsedAt'>,
  ): Promise<ApiKeyEntity> {
    const record = await prisma.apiKey.create({
      data: {
        id: data.id,
        name: data.name,
        apiKey: data.apiKey,
        isActive: data.isActive,
      },
    });
    return mapApiKey(record);
  }

  async findByKey(apiKey: string): Promise<ApiKeyEntity | null> {
    const record = await prisma.apiKey.findUnique({ where: { apiKey } });
    return record ? mapApiKey(record) : null;
  }

  async findById(id: string): Promise<ApiKeyEntity | null> {
    const record = await prisma.apiKey.findUnique({ where: { id } });
    return record ? mapApiKey(record) : null;
  }

  async list(): Promise<ApiKeyEntity[]> {
    const records = await prisma.apiKey.findMany({ orderBy: { createdAt: 'desc' } });
    return records.map(mapApiKey);
  }

  async updateStatus(id: string, isActive: boolean): Promise<ApiKeyEntity> {
    const record = await prisma.apiKey.update({
      where: { id },
      data: { isActive },
    });
    return mapApiKey(record);
  }

  async updateLastUsed(id: string): Promise<void> {
    await prisma.apiKey.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.apiKey.delete({ where: { id } });
  }
}
