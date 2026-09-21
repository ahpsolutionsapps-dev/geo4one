-- Offline-first sync para clientes, órdenes de compra, compras y movimientos de inventario.

CREATE SEQUENCE IF NOT EXISTS "Clientes_SyncSeq";
ALTER TABLE "Clientes" ADD COLUMN IF NOT EXISTS "Uuid" UUID;
ALTER TABLE "Clientes" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Clientes" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "Clientes" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "Clientes" SET "SyncSeq" = "IdCliente" WHERE "SyncSeq" = 0;
SELECT setval('"Clientes_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "Clientes"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Clientes_Uuid" ON "Clientes"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Clientes_SyncSeq" ON "Clientes"("SyncSeq");

CREATE SEQUENCE IF NOT EXISTS "OrdenesCompra_SyncSeq";
ALTER TABLE "OrdenesCompra" ADD COLUMN IF NOT EXISTS "Uuid" UUID;
ALTER TABLE "OrdenesCompra" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "OrdenesCompra" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "OrdenesCompra" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "OrdenesCompra" SET "SyncSeq" = "IdOrdenCompra" WHERE "SyncSeq" = 0;
SELECT setval('"OrdenesCompra_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "OrdenesCompra"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_OrdenesCompra_Uuid" ON "OrdenesCompra"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_OrdenesCompra_SyncSeq" ON "OrdenesCompra"("SyncSeq");

CREATE SEQUENCE IF NOT EXISTS "Compras_SyncSeq";
ALTER TABLE "Compras" ADD COLUMN IF NOT EXISTS "Uuid" UUID;
ALTER TABLE "Compras" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Compras" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "Compras" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "Compras" SET "SyncSeq" = "IdCompra" WHERE "SyncSeq" = 0;
SELECT setval('"Compras_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "Compras"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Compras_Uuid" ON "Compras"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Compras_SyncSeq" ON "Compras"("SyncSeq");

CREATE SEQUENCE IF NOT EXISTS "InventarioMovimientos_SyncSeq";
ALTER TABLE "InventarioMovimientos" ADD COLUMN IF NOT EXISTS "Uuid" UUID;
ALTER TABLE "InventarioMovimientos" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "InventarioMovimientos" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "InventarioMovimientos" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "InventarioMovimientos" SET "SyncSeq" = "IdMovimiento" WHERE "SyncSeq" = 0;
SELECT setval('"InventarioMovimientos_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "InventarioMovimientos"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_InventarioMovimientos_Uuid" ON "InventarioMovimientos"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_InventarioMovimientos_SyncSeq" ON "InventarioMovimientos"("SyncSeq");
