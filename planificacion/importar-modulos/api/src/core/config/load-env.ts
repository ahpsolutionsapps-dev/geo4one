import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

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

export const runtimeEnv = nodeEnv;
