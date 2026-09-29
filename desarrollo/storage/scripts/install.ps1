$ErrorActionPreference = "Stop"

Write-Host "Instalando dependencias..."
npm install

if (-not (Test-Path ".env.local")) {
  if (-not (Test-Path ".env")) {
    Write-Host "Creando .env.local desde .env.example..."
    Copy-Item ".env.example" ".env.local"
  }
}

New-Item -ItemType Directory -Force -Path storage, logs, database | Out-Null

Write-Host "Ejecutando migraciones..."
npx prisma migrate deploy

Write-Host "Ejecutando seed..."
npm run db:seed

Write-Host "Instalacion completada."
