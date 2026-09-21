-- Columnas de sync offline ya incluidas en 20260821010000_tareas_modulo para instalaciones nuevas.
-- ALTER idempotente para bases existentes creadas antes de consolidar la migracion.

CREATE SEQUENCE IF NOT EXISTS "Tareas_SyncSeq";

ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "Uuid" UUID;
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Tareas" ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;

UPDATE "Tareas" SET "Uuid" = gen_random_uuid() WHERE "Uuid" IS NULL;
UPDATE "Tareas" SET "SyncSeq" = "IdTarea" WHERE "SyncSeq" = 0;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Tareas'
      AND column_name = 'Uuid'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE "Tareas" ALTER COLUMN "Uuid" SET NOT NULL;
  END IF;
END $$;

SELECT setval(
  '"Tareas_SyncSeq"',
  COALESCE((SELECT MAX("SyncSeq") FROM "Tareas"), 1)
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Tareas_Uuid" ON "Tareas"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Tareas_SyncSeq" ON "Tareas"("SyncSeq");
