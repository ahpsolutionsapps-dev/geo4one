-- AlterTable ProductosMarcas
ALTER TABLE "ProductosMarcas" ADD COLUMN "Uuid" TEXT;

UPDATE "ProductosMarcas"
SET "Uuid" = (
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-' ||
  substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))), 2) || '-' ||
  lower(hex(randomblob(6)))
)
WHERE "Uuid" IS NULL;

CREATE UNIQUE INDEX "IX_ProductosMarcas_Uuid" ON "ProductosMarcas"("Uuid");

-- AlterTable ProductosCategorias
ALTER TABLE "ProductosCategorias" ADD COLUMN "Uuid" TEXT;

UPDATE "ProductosCategorias"
SET "Uuid" = (
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-' ||
  substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))), 2) || '-' ||
  lower(hex(randomblob(6)))
)
WHERE "Uuid" IS NULL;

CREATE UNIQUE INDEX "IX_ProductosCategorias_Uuid" ON "ProductosCategorias"("Uuid");

-- AlterTable ProductosSubcategorias
ALTER TABLE "ProductosSubcategorias" ADD COLUMN "Uuid" TEXT;

UPDATE "ProductosSubcategorias"
SET "Uuid" = (
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-' ||
  substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))), 2) || '-' ||
  lower(hex(randomblob(6)))
)
WHERE "Uuid" IS NULL;

CREATE UNIQUE INDEX "IX_ProductosSubcategorias_Uuid" ON "ProductosSubcategorias"("Uuid");

-- AlterTable Proveedores
ALTER TABLE "Proveedores" ADD COLUMN "Uuid" TEXT;

UPDATE "Proveedores"
SET "Uuid" = (
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-' ||
  substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))), 2) || '-' ||
  lower(hex(randomblob(6)))
)
WHERE "Uuid" IS NULL;

CREATE UNIQUE INDEX "IX_Proveedores_Uuid" ON "Proveedores"("Uuid");

-- AlterTable Productos
ALTER TABLE "Productos" ADD COLUMN "Uuid" TEXT;

UPDATE "Productos"
SET "Uuid" = (
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-' ||
  substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))), 2) || '-' ||
  lower(hex(randomblob(6)))
)
WHERE "Uuid" IS NULL;

CREATE UNIQUE INDEX "IX_Productos_Uuid" ON "Productos"("Uuid");
