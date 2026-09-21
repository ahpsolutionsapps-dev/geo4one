-- ============================================================
-- MÓDULO GENERAL DE ANUNCIANTES
-- PostgreSQL
-- PascalCase + Relaciones + Auditoría
-- ============================================================


-- ============================================================
-- 1. SECTORES INDUSTRIALES
-- ============================================================

CREATE TABLE "SectoresIndustriales" (
    "IdSectorIndustrial" BIGSERIAL PRIMARY KEY,
    "SectorIndustrial" VARCHAR(150) NOT NULL,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "UQ_SectoresIndustriales_SectorIndustrial"
        UNIQUE ("SectorIndustrial")
);


-- ============================================================
-- 2. SUB-SECTORES INDUSTRIALES
-- ============================================================

CREATE TABLE "SubSectoresIndustriales" (
    "IdSubSectorIndustrial" BIGSERIAL PRIMARY KEY,

    "IdSectorIndustrial" BIGINT NOT NULL,
    "SubSectorIndustrial" VARCHAR(150) NOT NULL,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_SubSectoresIndustriales_SectoresIndustriales"
        FOREIGN KEY ("IdSectorIndustrial")
        REFERENCES "SectoresIndustriales" ("IdSectorIndustrial"),

    CONSTRAINT "UQ_SubSectoresIndustriales_Sector_SubSector"
        UNIQUE ("IdSectorIndustrial", "SubSectorIndustrial")
);


-- ============================================================
-- 3. CATEGORÍAS DE ANUNCIANTES
-- ============================================================

CREATE TABLE "CategoriasAnunciantes" (
    "IdCategoriaAnunciante" BIGSERIAL PRIMARY KEY,

    "IdSectorIndustrial" BIGINT NOT NULL,
    "IdSubSectorIndustrial" BIGINT NOT NULL,

    "CategoriaAnunciante" VARCHAR(150) NOT NULL,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_CategoriasAnunciantes_SectoresIndustriales"
        FOREIGN KEY ("IdSectorIndustrial")
        REFERENCES "SectoresIndustriales" ("IdSectorIndustrial"),

    CONSTRAINT "FK_CategoriasAnunciantes_SubSectoresIndustriales"
        FOREIGN KEY ("IdSubSectorIndustrial")
        REFERENCES "SubSectoresIndustriales" ("IdSubSectorIndustrial"),

    CONSTRAINT "UQ_CategoriasAnunciantes_SubSector_Categoria"
        UNIQUE ("IdSubSectorIndustrial", "CategoriaAnunciante")
);


-- ============================================================
-- 4. ANUNCIANTES
-- ============================================================

CREATE TABLE "Anunciantes" (
    "IdAnunciante" BIGSERIAL PRIMARY KEY,

    "IdSectorIndustrial" BIGINT NOT NULL,
    "IdSubSectorIndustrial" BIGINT NOT NULL,
    "IdCategoriaAnunciante" BIGINT NOT NULL,

    "Anunciante" VARCHAR(200) NOT NULL,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_Anunciantes_SectoresIndustriales"
        FOREIGN KEY ("IdSectorIndustrial")
        REFERENCES "SectoresIndustriales" ("IdSectorIndustrial"),

    CONSTRAINT "FK_Anunciantes_SubSectoresIndustriales"
        FOREIGN KEY ("IdSubSectorIndustrial")
        REFERENCES "SubSectoresIndustriales" ("IdSubSectorIndustrial"),

    CONSTRAINT "FK_Anunciantes_CategoriasAnunciantes"
        FOREIGN KEY ("IdCategoriaAnunciante")
        REFERENCES "CategoriasAnunciantes" ("IdCategoriaAnunciante"),

    CONSTRAINT "UQ_Anunciantes_Categoria_Anunciante"
        UNIQUE ("IdCategoriaAnunciante", "Anunciante")
);


-- ============================================================
-- 5. MARCAS / PRODUCTOS
-- ============================================================

CREATE TABLE "MarcasProductos" (
    "IdMarcaProducto" BIGSERIAL PRIMARY KEY,

    "IdAnunciante" BIGINT NOT NULL,
    "IdCategoriaAnunciante" BIGINT NOT NULL,

    "MarcaProducto" VARCHAR(200) NOT NULL,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_MarcasProductos_Anunciantes"
        FOREIGN KEY ("IdAnunciante")
        REFERENCES "Anunciantes" ("IdAnunciante"),

    CONSTRAINT "FK_MarcasProductos_CategoriasAnunciantes"
        FOREIGN KEY ("IdCategoriaAnunciante")
        REFERENCES "CategoriasAnunciantes" ("IdCategoriaAnunciante"),

    CONSTRAINT "UQ_MarcasProductos_Anunciante_MarcaProducto"
        UNIQUE ("IdAnunciante", "MarcaProducto")
);


-- ============================================================
-- 6. ICONOS DE MARCA / PRODUCTO
-- ============================================================

CREATE TABLE "IconosMarcasProductos" (
    "IdIconoMarcaProducto" BIGSERIAL PRIMARY KEY,

    "IdMarcaProducto" BIGINT NOT NULL,

    -- Ruta o URL del archivo.
    -- Recomendado: guardar el archivo fuera de PostgreSQL.
    "Imagen" VARCHAR(500) NOT NULL,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_IconosMarcasProductos_MarcasProductos"
        FOREIGN KEY ("IdMarcaProducto")
        REFERENCES "MarcasProductos" ("IdMarcaProducto")
);


-- ============================================================
-- 7. PERIODOS DE COLOCACIÓN
-- ============================================================

CREATE TABLE "PeriodosColocacion" (
    "IdPeriodoColocacion" BIGSERIAL PRIMARY KEY,

    "FechaInicial" DATE NOT NULL,
    "FechaFinal" DATE NOT NULL,

    "GeneralesSeguimiento" TEXT,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "CHK_PeriodosColocacion_Fechas"
        CHECK ("FechaFinal" >= "FechaInicial")
);


-- ============================================================
-- 8. COMBOS DE ANUNCIANTES
-- ============================================================
-- No se crean MarcaProducto1, MarcaProducto2, etc.
-- Se utiliza una estructura cabecera/detalle.
-- Esto permite 1, 2, 4, 10 o más marcas en el futuro.
-- ============================================================

CREATE TABLE "CombosAnunciantes" (
    "IdComboAnunciante" BIGSERIAL PRIMARY KEY,

    -- Ejemplo:
    -- Coca-Cola / Sprite / Fanta / Dasani
    "ComboAnunciante" VARCHAR(1000) NOT NULL,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT
);


-- ============================================================
-- 8.1 DETALLE DEL COMBO
-- ============================================================

CREATE TABLE "CombosAnunciantesDetalles" (
    "IdComboAnuncianteDetalle" BIGSERIAL PRIMARY KEY,

    "IdComboAnunciante" BIGINT NOT NULL,
    "IdMarcaProducto" BIGINT NOT NULL,

    -- Permite controlar el orden de la nomenclatura
    "Orden" SMALLINT NOT NULL DEFAULT 1,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,

    CONSTRAINT "FK_CombosAnunciantesDetalles_CombosAnunciantes"
        FOREIGN KEY ("IdComboAnunciante")
        REFERENCES "CombosAnunciantes" ("IdComboAnunciante")
        ON DELETE CASCADE,

    CONSTRAINT "FK_CombosAnunciantesDetalles_MarcasProductos"
        FOREIGN KEY ("IdMarcaProducto")
        REFERENCES "MarcasProductos" ("IdMarcaProducto"),

    CONSTRAINT "UQ_CombosAnunciantesDetalles_Combo_Marca"
        UNIQUE ("IdComboAnunciante", "IdMarcaProducto"),

    CONSTRAINT "UQ_CombosAnunciantesDetalles_Combo_Orden"
        UNIQUE ("IdComboAnunciante", "Orden"),

    CONSTRAINT "CHK_CombosAnunciantesDetalles_Orden"
        CHECK ("Orden" > 0)
);


-- ============================================================
-- 9. VERSIONES / CAMPAÑAS
-- ============================================================

CREATE TABLE "VersionesCampanas" (
    "IdVersionCampana" BIGSERIAL PRIMARY KEY,

    "LeyendaSeguimiento" VARCHAR(500),

    "IdAnunciante" BIGINT NOT NULL,
    "IdMarcaProducto" BIGINT,

    "VersionCampana" VARCHAR(250) NOT NULL,

    -- Opcional porque una campaña puede pertenecer
    -- a una sola marca/producto sin utilizar combo.
    "IdComboAnunciante" BIGINT,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    -- Anulación
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "AnuladoPor" BIGINT,
    "ComentarioAnulado" VARCHAR(500),
    "FechaAnulacion" TIMESTAMPTZ,

    -- Auditoría
    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_VersionesCampanas_Anunciantes"
        FOREIGN KEY ("IdAnunciante")
        REFERENCES "Anunciantes" ("IdAnunciante"),

    CONSTRAINT "FK_VersionesCampanas_MarcasProductos"
        FOREIGN KEY ("IdMarcaProducto")
        REFERENCES "MarcasProductos" ("IdMarcaProducto"),

    CONSTRAINT "FK_VersionesCampanas_CombosAnunciantes"
        FOREIGN KEY ("IdComboAnunciante")
        REFERENCES "CombosAnunciantes" ("IdComboAnunciante"),

    CONSTRAINT "CHK_VersionesCampanas_Anulacion"
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


-- ============================================================
-- 10. FIRMA / MARCA DE AGUA PARA SEGUIMIENTO
-- ============================================================
-- Se relaciona con VersionCampana para saber a qué
-- campaña pertenecen la imagen y el video de muestra.
-- ============================================================

CREATE TABLE "FirmasMarcasAguaSeguimiento" (
    "IdFirmaMarcaAguaSeguimiento" BIGSERIAL PRIMARY KEY,

    "IdVersionCampana" BIGINT NOT NULL,

    -- Rutas o URLs de los archivos
    "ImagenMuestra" VARCHAR(500),
    "VideoMuestra" VARCHAR(500),

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_FirmasMarcasAgua_VersionesCampanas"
        FOREIGN KEY ("IdVersionCampana")
        REFERENCES "VersionesCampanas" ("IdVersionCampana")
);


-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX "IX_SubSectoresIndustriales_IdSectorIndustrial"
    ON "SubSectoresIndustriales" ("IdSectorIndustrial");

CREATE INDEX "IX_CategoriasAnunciantes_IdSectorIndustrial"
    ON "CategoriasAnunciantes" ("IdSectorIndustrial");

CREATE INDEX "IX_CategoriasAnunciantes_IdSubSectorIndustrial"
    ON "CategoriasAnunciantes" ("IdSubSectorIndustrial");

CREATE INDEX "IX_Anunciantes_IdSectorIndustrial"
    ON "Anunciantes" ("IdSectorIndustrial");

CREATE INDEX "IX_Anunciantes_IdSubSectorIndustrial"
    ON "Anunciantes" ("IdSubSectorIndustrial");

CREATE INDEX "IX_Anunciantes_IdCategoriaAnunciante"
    ON "Anunciantes" ("IdCategoriaAnunciante");

CREATE INDEX "IX_Anunciantes_Anunciante"
    ON "Anunciantes" ("Anunciante");

CREATE INDEX "IX_MarcasProductos_IdAnunciante"
    ON "MarcasProductos" ("IdAnunciante");

CREATE INDEX "IX_MarcasProductos_IdCategoriaAnunciante"
    ON "MarcasProductos" ("IdCategoriaAnunciante");

CREATE INDEX "IX_MarcasProductos_MarcaProducto"
    ON "MarcasProductos" ("MarcaProducto");

CREATE INDEX "IX_IconosMarcasProductos_IdMarcaProducto"
    ON "IconosMarcasProductos" ("IdMarcaProducto");

CREATE INDEX "IX_PeriodosColocacion_Fechas"
    ON "PeriodosColocacion" ("FechaInicial", "FechaFinal");

CREATE INDEX "IX_CombosAnunciantesDetalles_IdComboAnunciante"
    ON "CombosAnunciantesDetalles" ("IdComboAnunciante");

CREATE INDEX "IX_CombosAnunciantesDetalles_IdMarcaProducto"
    ON "CombosAnunciantesDetalles" ("IdMarcaProducto");

CREATE INDEX "IX_VersionesCampanas_IdAnunciante"
    ON "VersionesCampanas" ("IdAnunciante");

CREATE INDEX "IX_VersionesCampanas_IdMarcaProducto"
    ON "VersionesCampanas" ("IdMarcaProducto");

CREATE INDEX "IX_VersionesCampanas_IdComboAnunciante"
    ON "VersionesCampanas" ("IdComboAnunciante");

CREATE INDEX "IX_VersionesCampanas_VersionCampana"
    ON "VersionesCampanas" ("VersionCampana");

CREATE INDEX "IX_FirmasMarcasAgua_IdVersionCampana"
    ON "FirmasMarcasAguaSeguimiento" ("IdVersionCampana");


-- ============================================================
-- TRIGGERS FechaActualizacion
-- ============================================================
-- Se reutiliza la función creada en el script anterior:
--
-- "FnActualizarFechaActualizacion"()
-- ============================================================

CREATE TRIGGER "TR_SectoresIndustriales_FechaActualizacion"
BEFORE UPDATE ON "SectoresIndustriales"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_SubSectoresIndustriales_FechaActualizacion"
BEFORE UPDATE ON "SubSectoresIndustriales"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_CategoriasAnunciantes_FechaActualizacion"
BEFORE UPDATE ON "CategoriasAnunciantes"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_Anunciantes_FechaActualizacion"
BEFORE UPDATE ON "Anunciantes"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_MarcasProductos_FechaActualizacion"
BEFORE UPDATE ON "MarcasProductos"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_IconosMarcasProductos_FechaActualizacion"
BEFORE UPDATE ON "IconosMarcasProductos"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_PeriodosColocacion_FechaActualizacion"
BEFORE UPDATE ON "PeriodosColocacion"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_CombosAnunciantes_FechaActualizacion"
BEFORE UPDATE ON "CombosAnunciantes"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_VersionesCampanas_FechaActualizacion"
BEFORE UPDATE ON "VersionesCampanas"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_FirmasMarcasAguaSeguimiento_FechaActualizacion"
BEFORE UPDATE ON "FirmasMarcasAguaSeguimiento"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


-- ============================================================
-- TRIGGERS DE AUDITORÍA
-- ============================================================
-- Se reutiliza la función creada anteriormente:
--
-- "FnRegistrarAuditoria"()
-- ============================================================

CREATE TRIGGER "TR_Auditoria_SectoresIndustriales"
AFTER INSERT OR UPDATE OR DELETE ON "SectoresIndustriales"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdSectorIndustrial');


CREATE TRIGGER "TR_Auditoria_SubSectoresIndustriales"
AFTER INSERT OR UPDATE OR DELETE ON "SubSectoresIndustriales"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdSubSectorIndustrial');


CREATE TRIGGER "TR_Auditoria_CategoriasAnunciantes"
AFTER INSERT OR UPDATE OR DELETE ON "CategoriasAnunciantes"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdCategoriaAnunciante');


CREATE TRIGGER "TR_Auditoria_Anunciantes"
AFTER INSERT OR UPDATE OR DELETE ON "Anunciantes"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdAnunciante');


CREATE TRIGGER "TR_Auditoria_MarcasProductos"
AFTER INSERT OR UPDATE OR DELETE ON "MarcasProductos"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdMarcaProducto');


CREATE TRIGGER "TR_Auditoria_IconosMarcasProductos"
AFTER INSERT OR UPDATE OR DELETE ON "IconosMarcasProductos"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdIconoMarcaProducto');


CREATE TRIGGER "TR_Auditoria_PeriodosColocacion"
AFTER INSERT OR UPDATE OR DELETE ON "PeriodosColocacion"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdPeriodoColocacion');


CREATE TRIGGER "TR_Auditoria_CombosAnunciantes"
AFTER INSERT OR UPDATE OR DELETE ON "CombosAnunciantes"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdComboAnunciante');


CREATE TRIGGER "TR_Auditoria_CombosAnunciantesDetalles"
AFTER INSERT OR UPDATE OR DELETE ON "CombosAnunciantesDetalles"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdComboAnuncianteDetalle');


CREATE TRIGGER "TR_Auditoria_VersionesCampanas"
AFTER INSERT OR UPDATE OR DELETE ON "VersionesCampanas"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdVersionCampana');


CREATE TRIGGER "TR_Auditoria_FirmasMarcasAguaSeguimiento"
AFTER INSERT OR UPDATE OR DELETE ON "FirmasMarcasAguaSeguimiento"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdFirmaMarcaAguaSeguimiento');