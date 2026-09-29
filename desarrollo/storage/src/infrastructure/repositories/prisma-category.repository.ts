import { v4 as uuidv4 } from 'uuid';
import { FileCategoryEntity } from '../../domain/entities';
import { CategoryRepository } from '../../domain/repositories';
import { mapCategory } from '../database/mappers';
import { prisma } from '../database/prisma.client';

export class PrismaCategoryRepository implements CategoryRepository {
  async findOrCreateByNames(names: string[]): Promise<FileCategoryEntity[]> {
    const categories: FileCategoryEntity[] = [];

    for (const name of names) {
      const normalized = name.trim();
      if (!normalized) continue;

      const existing = await prisma.fileCategory.findFirst({
        where: { name: normalized },
      });

      if (existing) {
        categories.push(mapCategory(existing));
        continue;
      }

      const created = await prisma.fileCategory.create({
        data: { id: uuidv4(), name: normalized },
      });
      categories.push(mapCategory(created));
    }

    return categories;
  }

  async assignToFile(fileId: string, categoryIds: string[]): Promise<void> {
    await prisma.fileCategoryRelation.deleteMany({ where: { fileId } });

    if (categoryIds.length === 0) return;

    await prisma.fileCategoryRelation.createMany({
      data: categoryIds.map((categoryId) => ({ fileId, categoryId })),
    });
  }
}
