-- Offline-first sync para catálogos: marcas, proveedores, categorías, subcategorías y productos.

CREATE SEQUENCE IF NOT EXISTS "ProductosMarcas_SyncSeq";
ALTER TABLE "ProductosMarcas" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "ProductosMarcas" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "ProductosMarcas" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "ProductosMarcas" SET "SyncSeq" = "IdMarca" WHERE "SyncSeq" = 0;
SELECT setval('"ProductosMarcas_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "ProductosMarcas"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_ProductosMarcas_Uuid" ON "ProductosMarcas"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_ProductosMarcas_SyncSeq" ON "ProductosMarcas"("SyncSeq");

CREATE SEQUENCE IF NOT EXISTS "Proveedores_SyncSeq";
ALTER TABLE "Proveedores" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Proveedores" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "Proveedores" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "Proveedores" SET "SyncSeq" = "IdProveedor" WHERE "SyncSeq" = 0;
SELECT setval('"Proveedores_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "Proveedores"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Proveedores_Uuid" ON "Proveedores"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Proveedores_SyncSeq" ON "Proveedores"("SyncSeq");

CREATE SEQUENCE IF NOT EXISTS "ProductosCategorias_SyncSeq";
ALTER TABLE "ProductosCategorias" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "ProductosCategorias" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "ProductosCategorias" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "ProductosCategorias" SET "SyncSeq" = "IdCategoria" WHERE "SyncSeq" = 0;
SELECT setval('"ProductosCategorias_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "ProductosCategorias"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_ProductosCategorias_Uuid" ON "ProductosCategorias"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_ProductosCategorias_SyncSeq" ON "ProductosCategorias"("SyncSeq");

CREATE SEQUENCE IF NOT EXISTS "ProductosSubcategorias_SyncSeq";
ALTER TABLE "ProductosSubcategorias" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "ProductosSubcategorias" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "ProductosSubcategorias" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "ProductosSubcategorias" SET "SyncSeq" = "IdSubcategoria" WHERE "SyncSeq" = 0;
SELECT setval('"ProductosSubcategorias_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "ProductosSubcategorias"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_ProductosSubcategorias_Uuid" ON "ProductosSubcategorias"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_ProductosSubcategorias_SyncSeq" ON "ProductosSubcategorias"("SyncSeq");

CREATE SEQUENCE IF NOT EXISTS "Productos_SyncSeq";
ALTER TABLE "Productos" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Productos" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "Productos" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "Productos" SET "SyncSeq" = "IdProducto" WHERE "SyncSeq" = 0;
SELECT setval('"Productos_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "Productos"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Productos_Uuid" ON "Productos"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Productos_SyncSeq" ON "Productos"("SyncSeq");
