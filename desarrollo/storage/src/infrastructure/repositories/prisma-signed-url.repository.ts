import { SignedUrlEntity } from '../../domain/entities';
import { SignedUrlRepository } from '../../domain/repositories';
import { mapSignedUrl } from '../database/mappers';
import { prisma } from '../database/prisma.client';

export class PrismaSignedUrlRepository implements SignedUrlRepository {
  async create(data: Omit<SignedUrlEntity, 'createdAt'>): Promise<SignedUrlEntity> {
    const record = await prisma.signedUrl.create({ data });
    return mapSignedUrl(record);
  }

  async findByToken(token: string): Promise<SignedUrlEntity | null> {
    const record = await prisma.signedUrl.findUnique({ where: { token } });
    return record ? mapSignedUrl(record) : null;
  }

  async deleteExpired(): Promise<void> {
    await prisma.signedUrl.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
