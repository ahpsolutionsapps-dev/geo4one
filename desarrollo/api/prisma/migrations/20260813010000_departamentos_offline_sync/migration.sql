-- Offline-first sync: versionado incremental e idempotencia de operaciones.

CREATE SEQUENCE IF NOT EXISTS "Departamentos_SyncSeq";

ALTER TABLE "Departamentos"
  ADD COLUMN IF NOT EXISTS "Version" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "Departamentos"
  ADD COLUMN IF NOT EXISTS "SyncSeq" INTEGER NOT NULL DEFAULT 0;

UPDATE "Departamentos"
SET "Uuid" = gen_random_uuid()
WHERE "Uuid" IS NULL;

UPDATE "Departamentos"
SET "SyncSeq" = "IdDepartamento"
WHERE "SyncSeq" = 0;

SELECT setval(
  '"Departamentos_SyncSeq"',
  COALESCE((SELECT MAX("SyncSeq") FROM "Departamentos"), 1)
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Departamentos_Uuid" ON "Departamentos"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Departamentos_SyncSeq" ON "Departamentos"("SyncSeq");

CREATE TABLE IF NOT EXISTS "SyncOperations" (
  "OperationUuid" UUID PRIMARY KEY,
  "Entity" VARCHAR(80) NOT NULL,
  "EntityUuid" UUID NOT NULL,
  "Operation" VARCHAR(20) NOT NULL,
  "Result" VARCHAR(20) NOT NULL,
  "ResultPayload" JSONB,
  "ProcessedAt" TIMESTAMP(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "IDX_SyncOperations_Entity"
  ON "SyncOperations"("Entity", "EntityUuid");
