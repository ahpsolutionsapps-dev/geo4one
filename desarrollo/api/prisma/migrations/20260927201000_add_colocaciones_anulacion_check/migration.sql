-- Align Colocaciones annulment integrity with planning SQL.
ALTER TABLE "Colocaciones"
ADD CONSTRAINT "CHK_Colocaciones_Anulacion"
CHECK (
  (
    "Anulado" = FALSE
    AND "AnuladoPor" IS NULL
    AND "FechaAnulacion" IS NULL
  )
  OR
  (
    "Anulado" = TRUE
    AND "AnuladoPor" IS NOT NULL
    AND "FechaAnulacion" IS NOT NULL
  )
);
