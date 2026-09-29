import { v4 as uuidv4 } from 'uuid';
import { TagEntity } from '../../domain/entities';
import { TagRepository } from '../../domain/repositories';
import { mapTag } from '../database/mappers';
import { prisma } from '../database/prisma.client';

export class PrismaTagRepository implements TagRepository {
  async findOrCreateByNames(names: string[]): Promise<TagEntity[]> {
    const tags: TagEntity[] = [];

    for (const name of names) {
      const normalized = name.trim().toLowerCase();
      if (!normalized) continue;

      const existing = await prisma.tag.findUnique({ where: { name: normalized } });
      if (existing) {
        tags.push(mapTag(existing));
        continue;
      }

      const created = await prisma.tag.create({
        data: { id: uuidv4(), name: normalized },
      });
      tags.push(mapTag(created));
    }

    return tags;
  }

  async assignToFile(fileId: string, tagIds: string[]): Promise<void> {
    await prisma.fileTag.deleteMany({ where: { fileId } });

    if (tagIds.length === 0) return;

    await prisma.fileTag.createMany({
      data: tagIds.map((tagId) => ({ fileId, tagId })),
    });
  }
}
