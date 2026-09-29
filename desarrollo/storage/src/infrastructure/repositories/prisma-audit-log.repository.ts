import { AuditLogEntity } from '../../domain/entities';
import { AuditLogRepository } from '../../domain/repositories';
import { prisma } from '../database/prisma.client';

export class PrismaAuditLogRepository implements AuditLogRepository {
  async create(data: Omit<AuditLogEntity, 'createdAt'>): Promise<void> {
    await prisma.auditLog.create({ data });
  }
}
