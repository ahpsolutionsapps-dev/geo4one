import '../config/load-env';
import { createPrismaClient } from './create-prisma-client';

export const prisma = createPrismaClient();
