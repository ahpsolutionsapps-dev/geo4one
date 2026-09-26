

-- ============================================================
-- 1. PROVINCIAS
-- ============================================================

CREATE TABLE "Provincias" (
    "IdProvincia" BIGSERIAL PRIMARY KEY,
    "Provincia" VARCHAR(100) NOT NULL,
    "Latitud" NUMERIC(10,7),
    "Longitud" NUMERIC(10,7),
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "UQ_Provincias_Provincia"
        UNIQUE ("Provincia")
);


-- ============================================================
-- 2. MUNICIPIOS
-- ============================================================

CREATE TABLE "Municipios" (
    "IdMunicipio" BIGSERIAL PRIMARY KEY,
    "IdProvincia" BIGINT NOT NULL,
    "Municipio" VARCHAR(100) NOT NULL,
    "Latitud" NUMERIC(10,7),
    "Longitud" NUMERIC(10,7),
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_Municipios_Provincias"
        FOREIGN KEY ("IdProvincia")
        REFERENCES "Provincias" ("IdProvincia"),

    CONSTRAINT "UQ_Municipios_Provincia_Municipio"
        UNIQUE ("IdProvincia", "Municipio")
);


-- ============================================================
-- 3. SECTORES / BARRIOS
-- ============================================================

CREATE TABLE "SectoresBarrios" (
    "IdSectorBarrio" BIGSERIAL PRIMARY KEY,
    "IdMunicipio" BIGINT NOT NULL,
    "SectorBarrio" VARCHAR(150) NOT NULL,
    "Circunscripcion" VARCHAR(50),
    "Latitud" NUMERIC(10,7),
    "Longitud" NUMERIC(10,7),
    "Activo" BOOLEAN NOT NULL DEFAULT TRUE,

    "FechaCreacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "FK_SectoresBarrios_Municipios"
        FOREIGN KEY ("IdMunicipio")
        REFERENCES "Municipios" ("IdMunicipio"),

    CONSTRAINT "UQ_SectoresBarrios_Municipio_Sector"
        UNIQUE ("IdMunicipio", "SectorBarrio")
);
