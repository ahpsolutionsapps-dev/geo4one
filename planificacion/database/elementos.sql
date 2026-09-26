-- ============================================================
-- POSTGRESQL
-- MODELO DE ELEMENTOS / PROVEEDORES
-- PascalCase + Relaciones + Auditoría + Anulación
-- ============================================================


-- ============================================================
-- 4. PROVEEDORES / SUPLIDORES
-- ============================================================

CREATE TABLE "Proveedores" (
    "IdProveedor" BIGSERIAL PRIMARY KEY,

    "Proveedor" VARCHAR(200) NOT NULL,
    "RNC" VARCHAR(20),

    "PersonaContacto" VARCHAR(150),
    "Cargo" VARCHAR(100),
    "Email" VARCHAR(150),
    "PaginaWeb" VARCHAR(255),
    "Direccion" VARCHAR(500),

    "IdProvincia" BIGINT,
    "IdMunicipio" BIGINT,
    "IdSectorBarrio" BIGINT,

    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "UQ_Proveedores_RNC"
        UNIQUE ("RNC"),

    CONSTRAINT "FK_Proveedores_Provincias"
        FOREIGN KEY ("IdProvincia")
        REFERENCES "Provincias" ("IdProvincia"),

    CONSTRAINT "FK_Proveedores_Municipios"
        FOREIGN KEY ("IdMunicipio")
        REFERENCES "Municipios" ("IdMunicipio"),

    CONSTRAINT "FK_Proveedores_SectoresBarrios"
        FOREIGN KEY ("IdSectorBarrio")
        REFERENCES "SectoresBarrios" ("IdSectorBarrio")
);


-- ============================================================
-- 5. TELÉFONOS DE PROVEEDORES
-- ============================================================

CREATE TABLE "ProveedoresTelefonos" (
    "IdProveedorTelefono" BIGSERIAL PRIMARY KEY,
    "IdProveedor" BIGINT NOT NULL,

    "Telefono" VARCHAR(30) NOT NULL,
    "Tipo" VARCHAR(30),
    "Principal" BOOLEAN NOT NULL DEFAULT FALSE,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_ProveedoresTelefonos_Proveedores"
        FOREIGN KEY ("IdProveedor")
        REFERENCES "Proveedores" ("IdProveedor")
        ON DELETE CASCADE,

    CONSTRAINT "CHK_ProveedoresTelefonos_PrincipalTipo"
        CHECK (
            "Principal" = FALSE
            OR (
                "Tipo" IS NOT NULL
                AND LENGTH(TRIM("Tipo")) > 0
            )
        )
);


-- ============================================================
-- 6. ORIENTACIONES
-- ============================================================

CREATE TABLE "Orientaciones" (
    "IdOrientacion" BIGSERIAL PRIMARY KEY,
    "Orientacion" VARCHAR(100) NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "UQ_Orientaciones_Orientacion"
        UNIQUE ("Orientacion")
);


-- ============================================================
-- 7. TIPOS DE ELEMENTOS
-- ============================================================

CREATE TABLE "TiposElementos" (
    "IdTipoElemento" BIGSERIAL PRIMARY KEY,
    "TipoElemento" VARCHAR(150) NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "UQ_TiposElementos_TipoElemento"
        UNIQUE ("TipoElemento")
);


-- ============================================================
-- 8. FORMATOS
-- ============================================================

CREATE TABLE "Formatos" (
    "IdFormato" BIGSERIAL PRIMARY KEY,
    "IdTipoElemento" BIGINT NOT NULL,

    "Formato" VARCHAR(150) NOT NULL,
    "IconoMapa" VARCHAR(500),
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_Formatos_TiposElementos"
        FOREIGN KEY ("IdTipoElemento")
        REFERENCES "TiposElementos" ("IdTipoElemento"),

    CONSTRAINT "UQ_Formatos_TipoElemento_Formato"
        UNIQUE ("IdTipoElemento", "Formato")
);


-- ============================================================
-- 9. TAMAÑOS / DIMENSIONES
-- ============================================================

CREATE TABLE "Tamanos" (
    "IdTamano" BIGSERIAL PRIMARY KEY,
    "Tamano" VARCHAR(100) NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "UQ_Tamanos_Tamano"
        UNIQUE ("Tamano")
);


-- ============================================================
-- 10. ELEMENTOS
-- ============================================================

CREATE TABLE "Elementos" (
    "IdElemento" BIGSERIAL PRIMARY KEY,

    -- Proveedor
    "IdProveedor" BIGINT NOT NULL,

    -- Licencia
    "Licencia" VARCHAR(100),
    "FechaEmision" DATE,
    "FechaVencimiento" DATE,

    -- Seguimiento
    "IdSeguimiento" VARCHAR(100),

    -- Clasificación
    "IdTipoElemento" BIGINT NOT NULL,
    "IdFormato" BIGINT,
    "IdTamano" BIGINT,

    -- Estado
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    -- Costo
    "CostoAlquiler" NUMERIC(14,2),

    -- Ubicación
    "Direccion" VARCHAR(500),
    "IdOrientacion" BIGINT,
    "IdProvincia" BIGINT,
    "IdMunicipio" BIGINT,
    "IdSectorBarrio" BIGINT,
    "Circunscripcion" VARCHAR(50),

    -- Coordenadas
    "Latitud" NUMERIC(10,7),
    "Longitud" NUMERIC(10,7),

    -- ========================================================
    -- ANULACIÓN
    -- ========================================================

    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "AnuladoPor" BIGINT,
    "ComentarioAnulado" VARCHAR(500),
    "FechaAnulacion" TIMESTAMPTZ,

    -- ========================================================
    -- AUDITORÍA DEL REGISTRO
    -- ========================================================

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    -- ========================================================
    -- FOREIGN KEYS
    -- ========================================================

    CONSTRAINT "FK_Elementos_Proveedores"
        FOREIGN KEY ("IdProveedor")
        REFERENCES "Proveedores" ("IdProveedor"),

    CONSTRAINT "FK_Elementos_TiposElementos"
        FOREIGN KEY ("IdTipoElemento")
        REFERENCES "TiposElementos" ("IdTipoElemento"),

    CONSTRAINT "FK_Elementos_Formatos"
        FOREIGN KEY ("IdFormato")
        REFERENCES "Formatos" ("IdFormato"),

    CONSTRAINT "FK_Elementos_Tamanos"
        FOREIGN KEY ("IdTamano")
        REFERENCES "Tamanos" ("IdTamano"),

    CONSTRAINT "FK_Elementos_Orientaciones"
        FOREIGN KEY ("IdOrientacion")
        REFERENCES "Orientaciones" ("IdOrientacion"),

    CONSTRAINT "FK_Elementos_Provincias"
        FOREIGN KEY ("IdProvincia")
        REFERENCES "Provincias" ("IdProvincia"),

    CONSTRAINT "FK_Elementos_Municipios"
        FOREIGN KEY ("IdMunicipio")
        REFERENCES "Municipios" ("IdMunicipio"),

    CONSTRAINT "FK_Elementos_SectoresBarrios"
        FOREIGN KEY ("IdSectorBarrio")
        REFERENCES "SectoresBarrios" ("IdSectorBarrio"),

    -- ========================================================
    -- CHECKS
    -- ========================================================

    CONSTRAINT "CHK_Elementos_Fechas"
        CHECK (
            "FechaVencimiento" IS NULL
            OR "FechaEmision" IS NULL
            OR "FechaVencimiento" >= "FechaEmision"
        ),

    CONSTRAINT "CHK_Elementos_CostoAlquiler"
        CHECK (
            "CostoAlquiler" IS NULL
            OR "CostoAlquiler" >= 0
        ),

    CONSTRAINT "CHK_Elementos_Anulacion"
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
-- 11. AUDITORÍA GENERAL
-- ============================================================

CREATE TABLE "Auditoria" (
    "IdAuditoria" BIGSERIAL PRIMARY KEY,

    -- Entidad afectada
    "Tabla" VARCHAR(150) NOT NULL,
    "IdRegistro" BIGINT,

    -- INSERT / UPDATE / DELETE
    "Accion" VARCHAR(10) NOT NULL,

    -- Usuario que realizó la operación
    "IdUsuario" BIGINT,

    -- Valores completos antes y después
    "DatosAnteriores" JSONB,
    "DatosNuevos" JSONB,

    -- Información de la solicitud
    "DireccionIP" INET,
    "UserAgent" TEXT,

    "Fecha" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CHK_Auditoria_Accion"
        CHECK ("Accion" IN ('INSERT', 'UPDATE', 'DELETE'))
);


-- ============================================================
-- ÍNDICES GEOGRÁFICOS / RELACIONES
-- ============================================================

CREATE INDEX "IX_Municipios_IdProvincia"
    ON "Municipios" ("IdProvincia");

CREATE INDEX "IX_SectoresBarrios_IdMunicipio"
    ON "SectoresBarrios" ("IdMunicipio");


-- ============================================================
-- ÍNDICES PROVEEDORES
-- ============================================================

CREATE INDEX "IX_Proveedores_Proveedor"
    ON "Proveedores" ("Proveedor");

CREATE INDEX "IX_Proveedores_IdProvincia"
    ON "Proveedores" ("IdProvincia");

CREATE INDEX "IX_Proveedores_IdMunicipio"
    ON "Proveedores" ("IdMunicipio");

CREATE INDEX "IX_Proveedores_IdSectorBarrio"
    ON "Proveedores" ("IdSectorBarrio");

CREATE INDEX "IX_ProveedoresTelefonos_IdProveedor"
    ON "ProveedoresTelefonos" ("IdProveedor");

CREATE UNIQUE INDEX "UX_ProveedoresTelefonos_Principal_Activo"
    ON "ProveedoresTelefonos" ("IdProveedor")
    WHERE "Principal" = TRUE AND "Activo" = TRUE;


-- ============================================================
-- ÍNDICES FORMATOS
-- ============================================================

CREATE INDEX "IX_Formatos_IdTipoElemento"
    ON "Formatos" ("IdTipoElemento");


-- ============================================================
-- ÍNDICES ELEMENTOS
-- ============================================================

CREATE INDEX "IX_Elementos_IdProveedor"
    ON "Elementos" ("IdProveedor");

CREATE INDEX "IX_Elementos_IdTipoElemento"
    ON "Elementos" ("IdTipoElemento");

CREATE INDEX "IX_Elementos_IdFormato"
    ON "Elementos" ("IdFormato");

CREATE INDEX "IX_Elementos_IdTamano"
    ON "Elementos" ("IdTamano");

CREATE INDEX "IX_Elementos_IdOrientacion"
    ON "Elementos" ("IdOrientacion");

CREATE INDEX "IX_Elementos_IdProvincia"
    ON "Elementos" ("IdProvincia");

CREATE INDEX "IX_Elementos_IdMunicipio"
    ON "Elementos" ("IdMunicipio");

CREATE INDEX "IX_Elementos_IdSectorBarrio"
    ON "Elementos" ("IdSectorBarrio");

CREATE INDEX "IX_Elementos_IdSeguimiento"
    ON "Elementos" ("IdSeguimiento");

CREATE INDEX "IX_Elementos_Licencia"
    ON "Elementos" ("Licencia");

CREATE INDEX "IX_Elementos_Activo"
    ON "Elementos" ("Activo");

CREATE INDEX "IX_Elementos_Anulado"
    ON "Elementos" ("Anulado");


-- ============================================================
-- ÍNDICES AUDITORÍA
-- ============================================================

CREATE INDEX "IX_Auditoria_Tabla_IdRegistro"
    ON "Auditoria" ("Tabla", "IdRegistro");

CREATE INDEX "IX_Auditoria_IdUsuario"
    ON "Auditoria" ("IdUsuario");

CREATE INDEX "IX_Auditoria_Fecha"
    ON "Auditoria" ("Fecha");

CREATE INDEX "IX_Auditoria_Accion"
    ON "Auditoria" ("Accion");


-- ============================================================
-- FUNCIÓN PARA FechaActualizacion
-- ============================================================

CREATE OR REPLACE FUNCTION "FnActualizarFechaActualizacion"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW."FechaActualizacion" = CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$;


-- ============================================================
-- TRIGGERS PARA FechaActualizacion
-- ============================================================

CREATE TRIGGER "TR_Provincias_FechaActualizacion"
BEFORE UPDATE ON "Provincias"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_Municipios_FechaActualizacion"
BEFORE UPDATE ON "Municipios"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_SectoresBarrios_FechaActualizacion"
BEFORE UPDATE ON "SectoresBarrios"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_Proveedores_FechaActualizacion"
BEFORE UPDATE ON "Proveedores"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_ProveedoresTelefonos_FechaActualizacion"
BEFORE UPDATE ON "ProveedoresTelefonos"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_Orientaciones_FechaActualizacion"
BEFORE UPDATE ON "Orientaciones"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_TiposElementos_FechaActualizacion"
BEFORE UPDATE ON "TiposElementos"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_Formatos_FechaActualizacion"
BEFORE UPDATE ON "Formatos"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_Tamanos_FechaActualizacion"
BEFORE UPDATE ON "Tamanos"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


CREATE TRIGGER "TR_Elementos_FechaActualizacion"
BEFORE UPDATE ON "Elementos"
FOR EACH ROW
EXECUTE PROCEDURE "FnActualizarFechaActualizacion"();


-- ============================================================
-- FUNCIÓN GENERAL DE AUDITORÍA
-- ============================================================
--
-- Desde la API se puede establecer:
--
-- SET LOCAL app.id_usuario = '15';
-- SET LOCAL app.ip = '192.168.1.100';
-- SET LOCAL app.user_agent = 'Mozilla/5.0...';
--
-- Debe ejecutarse dentro de la misma transacción.
-- ============================================================

CREATE OR REPLACE FUNCTION "FnRegistrarAuditoria"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_usuario BIGINT;
    v_ip INET;
    v_user_agent TEXT;
    v_id_registro BIGINT;
BEGIN

    -- ========================================================
    -- CONTEXTO DEL USUARIO
    -- ========================================================

    BEGIN
        v_id_usuario :=
            NULLIF(
                current_setting('app.id_usuario', TRUE),
                ''
            )::BIGINT;
    EXCEPTION
        WHEN OTHERS THEN
            v_id_usuario := NULL;
    END;


    -- ========================================================
    -- DIRECCIÓN IP
    -- ========================================================

    BEGIN
        v_ip :=
            NULLIF(
                current_setting('app.ip', TRUE),
                ''
            )::INET;
    EXCEPTION
        WHEN OTHERS THEN
            v_ip := NULL;
    END;


    -- ========================================================
    -- USER AGENT
    -- ========================================================

    v_user_agent :=
        NULLIF(
            current_setting('app.user_agent', TRUE),
            ''
        );


    -- ========================================================
    -- INSERT
    -- ========================================================

    IF TG_OP = 'INSERT' THEN

        v_id_registro :=
            NULLIF(
                to_jsonb(NEW) ->> TG_ARGV[0],
                ''
            )::BIGINT;

        INSERT INTO "Auditoria" (
            "Tabla",
            "IdRegistro",
            "Accion",
            "IdUsuario",
            "DatosAnteriores",
            "DatosNuevos",
            "DireccionIP",
            "UserAgent"
        )
        VALUES (
            TG_TABLE_NAME,
            v_id_registro,
            'INSERT',
            v_id_usuario,
            NULL,
            to_jsonb(NEW),
            v_ip,
            v_user_agent
        );

        RETURN NEW;


    -- ========================================================
    -- UPDATE
    -- ========================================================

    ELSIF TG_OP = 'UPDATE' THEN

        v_id_registro :=
            NULLIF(
                to_jsonb(NEW) ->> TG_ARGV[0],
                ''
            )::BIGINT;

        INSERT INTO "Auditoria" (
            "Tabla",
            "IdRegistro",
            "Accion",
            "IdUsuario",
            "DatosAnteriores",
            "DatosNuevos",
            "DireccionIP",
            "UserAgent"
        )
        VALUES (
            TG_TABLE_NAME,
            v_id_registro,
            'UPDATE',
            v_id_usuario,
            to_jsonb(OLD),
            to_jsonb(NEW),
            v_ip,
            v_user_agent
        );

        RETURN NEW;


    -- ========================================================
    -- DELETE
    -- ========================================================

    ELSIF TG_OP = 'DELETE' THEN

        v_id_registro :=
            NULLIF(
                to_jsonb(OLD) ->> TG_ARGV[0],
                ''
            )::BIGINT;

        INSERT INTO "Auditoria" (
            "Tabla",
            "IdRegistro",
            "Accion",
            "IdUsuario",
            "DatosAnteriores",
            "DatosNuevos",
            "DireccionIP",
            "UserAgent"
        )
        VALUES (
            TG_TABLE_NAME,
            v_id_registro,
            'DELETE',
            v_id_usuario,
            to_jsonb(OLD),
            NULL,
            v_ip,
            v_user_agent
        );

        RETURN OLD;

    END IF;

    RETURN NULL;
END;
$$;


-- ============================================================
-- TRIGGERS DE AUDITORÍA
-- ============================================================

CREATE TRIGGER "TR_Auditoria_Provincias"
AFTER INSERT OR UPDATE OR DELETE ON "Provincias"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdProvincia');


CREATE TRIGGER "TR_Auditoria_Municipios"
AFTER INSERT OR UPDATE OR DELETE ON "Municipios"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdMunicipio');


CREATE TRIGGER "TR_Auditoria_SectoresBarrios"
AFTER INSERT OR UPDATE OR DELETE ON "SectoresBarrios"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdSectorBarrio');


CREATE TRIGGER "TR_Auditoria_Proveedores"
AFTER INSERT OR UPDATE OR DELETE ON "Proveedores"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdProveedor');


CREATE TRIGGER "TR_Auditoria_ProveedoresTelefonos"
AFTER INSERT OR UPDATE OR DELETE ON "ProveedoresTelefonos"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdProveedorTelefono');


CREATE TRIGGER "TR_Auditoria_Orientaciones"
AFTER INSERT OR UPDATE OR DELETE ON "Orientaciones"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdOrientacion');


CREATE TRIGGER "TR_Auditoria_TiposElementos"
AFTER INSERT OR UPDATE OR DELETE ON "TiposElementos"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdTipoElemento');


CREATE TRIGGER "TR_Auditoria_Formatos"
AFTER INSERT OR UPDATE OR DELETE ON "Formatos"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdFormato');


CREATE TRIGGER "TR_Auditoria_Tamanos"
AFTER INSERT OR UPDATE OR DELETE ON "Tamanos"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdTamano');


CREATE TRIGGER "TR_Auditoria_Elementos"
AFTER INSERT OR UPDATE OR DELETE ON "Elementos"
FOR EACH ROW
EXECUTE PROCEDURE "FnRegistrarAuditoria"('IdElemento');