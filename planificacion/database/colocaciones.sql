-- ============================================================
-- MÓDULO: SEGUIMIENTOS / COLOCACIONES
-- ============================================================

CREATE TABLE "Colocaciones" (
    "IdColocacion" BIGSERIAL PRIMARY KEY,

    -- ========================================================
    -- IDENTIFICACIÓN
    -- ========================================================

    "CodigoSeguimiento" VARCHAR(50) NOT NULL,

    -- ========================================================
    -- ELEMENTO PUBLICITARIO
    -- ========================================================

    "IdElemento" BIGINT NOT NULL,

    -- ========================================================
    -- CAMPAÑA
    -- ========================================================

    "IdVersionCampana" BIGINT NOT NULL,

    -- ========================================================
    -- PERIODO
    -- ========================================================

    "IdPeriodoColocacion" BIGINT NOT NULL,

    -- ========================================================
    -- OBSERVACIONES DEL SEGUIMIENTO
    -- ========================================================

    "Observaciones" TEXT,

    -- ========================================================
    -- ESTADO
    -- ========================================================

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    -- ========================================================
    -- ANULACIÓN
    -- ========================================================

    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "AnuladoPor" BIGINT,
    "ComentarioAnulado" VARCHAR(500),
    "FechaAnulacion" TIMESTAMPTZ,

    -- ========================================================
    -- AUDITORÍA
    -- ========================================================

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    -- ========================================================
    -- RELACIONES
    -- ========================================================

    CONSTRAINT "FK_Colocaciones_Elementos"
        FOREIGN KEY ("IdElemento")
        REFERENCES "Elementos" ("IdElemento"),

    CONSTRAINT "FK_Colocaciones_VersionesCampanas"
        FOREIGN KEY ("IdVersionCampana")
        REFERENCES "VersionesCampanas" ("IdVersionCampana"),

    CONSTRAINT "FK_Colocaciones_PeriodosColocacion"
        FOREIGN KEY ("IdPeriodoColocacion")
        REFERENCES "PeriodosColocacion" ("IdPeriodoColocacion"),

    -- ========================================================
    -- RESTRICCIONES
    -- ========================================================

    CONSTRAINT "UQ_Colocaciones_CodigoSeguimiento"
        UNIQUE ("CodigoSeguimiento"),

    CONSTRAINT "CHK_Colocaciones_Anulacion"
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
        )
);