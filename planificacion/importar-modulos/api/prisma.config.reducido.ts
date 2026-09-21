import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'prisma/config';

const nodeEnv = process.env.NODE_ENV ?? 'development';

function loadEnvFile(filename: string, override: boolean): void {
  const filePath = resolve(process.cwd(), filename);
  if (existsSync(filePath)) {
    config({ path: filePath, override });
  }
}

loadEnvFile('.env', false);
loadEnvFile('.env.local', true);
loadEnvFile(`.env.${nodeEnv}`, true);
loadEnvFile(`.env.${nodeEnv}.local`, true);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations-reducido',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
