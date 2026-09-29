#!/usr/bin/env bash
set -euo pipefail

echo "Instalando dependencias..."
npm install

if [ ! -f .env.local ] && [ ! -f .env ]; then
  echo "Creando .env.local desde .env.example..."
  cp .env.example .env.local
fi

mkdir -p storage logs database

echo "Ejecutando migraciones..."
npx prisma migrate deploy

echo "Ejecutando seed..."
npm run db:seed

echo "Instalación completada."
