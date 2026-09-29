import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { FileValidator } from '../src/domain/services/file-validator.service';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const existing = await prisma.apiKey.count();
  if (existing > 0) {
    console.log('Seed omitido: ya existen API Keys');
    return;
  }

  const defaultKey = FileValidator.generateApiKey();
  await prisma.apiKey.create({
    data: {
      id: uuidv4(),
      name: 'Default Application',
      apiKey: defaultKey,
      isActive: 1,
    },
  });

  console.log('API Key por defecto creada:');
  console.log(defaultKey);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
