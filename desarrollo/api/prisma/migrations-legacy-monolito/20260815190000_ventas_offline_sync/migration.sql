-- Offline-first sync para ventas.

CREATE SEQUENCE IF NOT EXISTS "Ventas_SyncSeq";
ALTER TABLE "Ventas" ADD COLUMN IF NOT EXISTS "Uuid" UUID;
ALTER TABLE "Ventas" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Ventas" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;
UPDATE "Ventas" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "Ventas" SET "SyncSeq" = "IdVenta" WHERE "SyncSeq" = 0;
SELECT setval('"Ventas_SyncSeq"', COALESCE((SELECT MAX("SyncSeq") FROM "Ventas"), 1));
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Ventas_Uuid" ON "Ventas"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Ventas_SyncSeq" ON "Ventas"("SyncSeq");
