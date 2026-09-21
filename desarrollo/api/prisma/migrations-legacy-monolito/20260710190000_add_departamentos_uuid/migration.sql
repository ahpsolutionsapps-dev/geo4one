-- AlterTable
ALTER TABLE "Departamentos" ADD COLUMN "Uuid" TEXT;

-- UUID fijo para el departamento por defecto
UPDATE "Departamentos"
SET "Uuid" = 'd1000001-0000-4000-8000-000000000001'
WHERE "IdDepartamento" = 1;

-- Backfill para registros existentes sin UUID
UPDATE "Departamentos"
SET "Uuid" = (
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-' ||
  substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))), 2) || '-' ||
  lower(hex(randomblob(6)))
)
WHERE "Uuid" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IX_Departamentos_Uuid" ON "Departamentos"("Uuid");
