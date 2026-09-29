#!/usr/bin/env bash
set -euo pipefail

echo "Aplicando migraciones..."
npx prisma migrate deploy
echo "Migraciones aplicadas."
