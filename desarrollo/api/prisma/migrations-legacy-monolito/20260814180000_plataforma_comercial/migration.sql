-- Plataforma comercial (Fase 1). Independiente del ERP operativo.

CREATE TABLE "ComercialAgentes" (
    "IdAgente" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Email" VARCHAR(150) NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Telefono" VARCHAR(30),
    "Rol" VARCHAR(40) NOT NULL,
    "PuedePersonalizar" BOOLEAN NOT NULL DEFAULT FALSE,
    "Habilitado" BOOLEAN NOT NULL DEFAULT TRUE,
    "Verificado" BOOLEAN NOT NULL DEFAULT TRUE,
    "UltimoAcceso" TIMESTAMP,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "ComentarioAnulado" TEXT,
    "IdAgenteRegistra" INTEGER,
    "IdAgenteModifica" INTEGER,
    "IdAgenteAnula" INTEGER,
    CONSTRAINT "UQ_ComercialAgentes_Email" UNIQUE ("Email"),
    CONSTRAINT "CK_ComercialAgentes_Rol" CHECK (
        "Rol" IN ('ADMIN_PLATAFORMA', 'AGENTE', 'AGENTE_AUTORIZADO')
    )
);

CREATE INDEX "IX_ComercialAgentes_Anulado" ON "ComercialAgentes" ("Anulado");

CREATE TABLE "TiposNegocio" (
    "IdTipoNegocio" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Codigo" VARCHAR(50) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Descripcion" TEXT,
    "Estatus" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "ComentarioAnulado" TEXT,
    "IdAgenteRegistra" INTEGER,
    "IdAgenteModifica" INTEGER,
    "IdAgenteAnula" INTEGER,
    CONSTRAINT "UQ_TiposNegocio_Codigo" UNIQUE ("Codigo")
);

CREATE TABLE "AplicacionesComerciales" (
    "IdAplicacion" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Codigo" VARCHAR(50) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Descripcion" TEXT,
    "PrecioAdicional" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "Estatus" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "ComentarioAnulado" TEXT,
    "IdAgenteRegistra" INTEGER,
    "IdAgenteModifica" INTEGER,
    "IdAgenteAnula" INTEGER,
    CONSTRAINT "UQ_AplicacionesComerciales_Codigo" UNIQUE ("Codigo")
);

CREATE TABLE "PlanesComerciales" (
    "IdPlan" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Codigo" VARCHAR(50) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Descripcion" TEXT,
    "Precio" DECIMAL(12, 2) NOT NULL,
    "Moneda" VARCHAR(10) NOT NULL DEFAULT 'DOP',
    "PeriodoFacturacion" VARCHAR(20) NOT NULL DEFAULT 'MENSUAL',
    "MaxUsuarios" INTEGER NOT NULL DEFAULT 1,
    "MaxSucursales" INTEGER NOT NULL DEFAULT 1,
    "MaxDispositivos" INTEGER NOT NULL DEFAULT 1,
    "PrecioUsuarioExtra" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "PrecioSucursalExtra" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "PrecioDispositivoExtra" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    "Estatus" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "ComentarioAnulado" TEXT,
    "IdAgenteRegistra" INTEGER,
    "IdAgenteModifica" INTEGER,
    "IdAgenteAnula" INTEGER,
    CONSTRAINT "UQ_PlanesComerciales_Codigo" UNIQUE ("Codigo"),
    CONSTRAINT "CK_PlanesComerciales_Periodo" CHECK (
        "PeriodoFacturacion" IN ('MENSUAL', 'ANUAL')
    )
);

CREATE TABLE "PlanAplicaciones" (
    "IdPlanAplicacion" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "IdPlan" INTEGER NOT NULL,
    "IdAplicacion" INTEGER NOT NULL,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "UQ_PlanAplicaciones_Plan_Aplicacion" UNIQUE ("IdPlan", "IdAplicacion"),
    CONSTRAINT "FK_PlanAplicaciones_Plan" FOREIGN KEY ("IdPlan") REFERENCES "PlanesComerciales" ("IdPlan") ON DELETE CASCADE,
    CONSTRAINT "FK_PlanAplicaciones_Aplicacion" FOREIGN KEY ("IdAplicacion") REFERENCES "AplicacionesComerciales" ("IdAplicacion")
);

CREATE TABLE "TipoNegocioPlanes" (
    "IdTipoNegocioPlan" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "IdTipoNegocio" INTEGER NOT NULL,
    "IdPlan" INTEGER NOT NULL,
    "EsRecomendado" BOOLEAN NOT NULL DEFAULT FALSE,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "UQ_TipoNegocioPlanes_Tipo_Plan" UNIQUE ("IdTipoNegocio", "IdPlan"),
    CONSTRAINT "FK_TipoNegocioPlanes_Tipo" FOREIGN KEY ("IdTipoNegocio") REFERENCES "TiposNegocio" ("IdTipoNegocio") ON DELETE CASCADE,
    CONSTRAINT "FK_TipoNegocioPlanes_Plan" FOREIGN KEY ("IdPlan") REFERENCES "PlanesComerciales" ("IdPlan")
);

CREATE UNIQUE INDEX "UQ_TipoNegocioPlanes_Recomendado"
ON "TipoNegocioPlanes" ("IdTipoNegocio")
WHERE "EsRecomendado" = TRUE AND "Anulado" = FALSE;

CREATE TABLE "Preregistros" (
    "IdPreregistro" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "IdAgente" INTEGER NOT NULL,
    "IdTipoNegocio" INTEGER NOT NULL,
    "IdPlan" INTEGER NOT NULL,
    "IdNegocio" INTEGER,
    "NombreNegocio" VARCHAR(150) NOT NULL,
    "NombreContacto" VARCHAR(150) NOT NULL,
    "EmailContacto" VARCHAR(150) NOT NULL,
    "TelefonoContacto" VARCHAR(30),
    "UsuariosEstimados" INTEGER NOT NULL DEFAULT 1,
    "SucursalesEstimadas" INTEGER NOT NULL DEFAULT 1,
    "DispositivosEstimados" INTEGER NOT NULL DEFAULT 1,
    "PlanCodigo" VARCHAR(50) NOT NULL,
    "PlanNombre" VARCHAR(150) NOT NULL,
    "Precio" DECIMAL(12, 2) NOT NULL,
    "Moneda" VARCHAR(10) NOT NULL DEFAULT 'DOP',
    "PeriodoFacturacion" VARCHAR(20) NOT NULL DEFAULT 'MENSUAL',
    "MaxUsuarios" INTEGER NOT NULL,
    "MaxSucursales" INTEGER NOT NULL,
    "MaxDispositivos" INTEGER NOT NULL,
    "Personalizado" BOOLEAN NOT NULL DEFAULT FALSE,
    "PrecioManual" BOOLEAN NOT NULL DEFAULT FALSE,
    "Estatus" VARCHAR(30) NOT NULL DEFAULT 'BORRADOR',
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "ComentarioAnulado" TEXT,
    "IdAgenteRegistra" INTEGER,
    "IdAgenteModifica" INTEGER,
    "IdAgenteAnula" INTEGER,
    CONSTRAINT "FK_Preregistros_Agente" FOREIGN KEY ("IdAgente") REFERENCES "ComercialAgentes" ("IdAgente"),
    CONSTRAINT "FK_Preregistros_TipoNegocio" FOREIGN KEY ("IdTipoNegocio") REFERENCES "TiposNegocio" ("IdTipoNegocio"),
    CONSTRAINT "FK_Preregistros_Plan" FOREIGN KEY ("IdPlan") REFERENCES "PlanesComerciales" ("IdPlan"),
    CONSTRAINT "FK_Preregistros_Negocio" FOREIGN KEY ("IdNegocio") REFERENCES "Negocios" ("IdNegocio"),
    CONSTRAINT "CK_Preregistros_Estatus" CHECK (
        "Estatus" IN (
            'BORRADOR',
            'PENDIENTE_ACTIVACION',
            'INVITADO',
            'ACTIVADO',
            'RECHAZADO',
            'VENCIDO',
            'CANCELADO'
        )
    )
);

CREATE INDEX "IX_Preregistros_IdAgente" ON "Preregistros" ("IdAgente");
CREATE INDEX "IX_Preregistros_Estatus" ON "Preregistros" ("Estatus");

CREATE TABLE "PreregistroAplicaciones" (
    "IdPreregistroAplicacion" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "IdPreregistro" INTEGER NOT NULL,
    "Codigo" VARCHAR(50) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Incluida" BOOLEAN NOT NULL DEFAULT TRUE,
    "PrecioAdicional" DECIMAL(12, 2) NOT NULL DEFAULT 0,
    CONSTRAINT "FK_PreregistroAplicaciones_Preregistro" FOREIGN KEY ("IdPreregistro") REFERENCES "Preregistros" ("IdPreregistro") ON DELETE CASCADE
);

CREATE TABLE "PreregistroPersonalizaciones" (
    "IdPersonalizacion" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "IdPreregistro" INTEGER NOT NULL,
    "IdAgente" INTEGER NOT NULL,
    "TipoCambio" VARCHAR(40) NOT NULL,
    "Detalle" JSONB NOT NULL,
    "PrecioAnterior" DECIMAL(12, 2) NOT NULL,
    "PrecioNuevo" DECIMAL(12, 2) NOT NULL,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_PreregistroPersonalizaciones_Preregistro" FOREIGN KEY ("IdPreregistro") REFERENCES "Preregistros" ("IdPreregistro") ON DELETE CASCADE,
    CONSTRAINT "FK_PreregistroPersonalizaciones_Agente" FOREIGN KEY ("IdAgente") REFERENCES "ComercialAgentes" ("IdAgente")
);

CREATE TABLE "Invitaciones" (
    "IdInvitacion" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "IdPreregistro" INTEGER NOT NULL,
    "IdAgente" INTEGER NOT NULL,
    "Email" VARCHAR(150) NOT NULL,
    "TokenHash" VARCHAR(64) NOT NULL,
    "ExpiraEn" TIMESTAMP NOT NULL,
    "AceptadaEn" TIMESTAMP,
    "Estatus" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "UQ_Invitaciones_TokenHash" UNIQUE ("TokenHash"),
    CONSTRAINT "FK_Invitaciones_Preregistro" FOREIGN KEY ("IdPreregistro") REFERENCES "Preregistros" ("IdPreregistro"),
    CONSTRAINT "FK_Invitaciones_Agente" FOREIGN KEY ("IdAgente") REFERENCES "ComercialAgentes" ("IdAgente"),
    CONSTRAINT "CK_Invitaciones_Estatus" CHECK (
        "Estatus" IN ('PENDIENTE', 'ACEPTADA', 'VENCIDA', 'CANCELADA')
    )
);

CREATE INDEX "IX_Invitaciones_IdPreregistro" ON "Invitaciones" ("IdPreregistro");

CREATE TABLE "Suscripciones" (
    "IdSuscripcion" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "IdPreregistro" INTEGER NOT NULL,
    "IdAgente" INTEGER NOT NULL,
    "IdNegocio" INTEGER,
    "PlanCodigo" VARCHAR(50) NOT NULL,
    "PlanNombre" VARCHAR(150) NOT NULL,
    "Precio" DECIMAL(12, 2) NOT NULL,
    "Moneda" VARCHAR(10) NOT NULL DEFAULT 'DOP',
    "PeriodoFacturacion" VARCHAR(20) NOT NULL DEFAULT 'MENSUAL',
    "MaxUsuarios" INTEGER NOT NULL,
    "MaxSucursales" INTEGER NOT NULL,
    "MaxDispositivos" INTEGER NOT NULL,
    "FechaInicio" TIMESTAMP,
    "FechaVencimiento" TIMESTAMP,
    "Estatus" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "ComentarioAnulado" TEXT,
    CONSTRAINT "FK_Suscripciones_Preregistro" FOREIGN KEY ("IdPreregistro") REFERENCES "Preregistros" ("IdPreregistro"),
    CONSTRAINT "FK_Suscripciones_Agente" FOREIGN KEY ("IdAgente") REFERENCES "ComercialAgentes" ("IdAgente"),
    CONSTRAINT "FK_Suscripciones_Negocio" FOREIGN KEY ("IdNegocio") REFERENCES "Negocios" ("IdNegocio"),
    CONSTRAINT "CK_Suscripciones_Estatus" CHECK (
        "Estatus" IN ('PENDIENTE', 'ACTIVA', 'SUSPENDIDA', 'VENCIDA', 'CANCELADA')
    )
);

CREATE INDEX "IX_Suscripciones_IdAgente" ON "Suscripciones" ("IdAgente");
CREATE INDEX "IX_Suscripciones_Estatus" ON "Suscripciones" ("Estatus");

CREATE TABLE "SuscripcionLicencias" (
    "IdLicencia" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "IdSuscripcion" INTEGER NOT NULL,
    "Codigo" VARCHAR(50) NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Estatus" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "ActivadaEn" TIMESTAMP,
    "VenceEn" TIMESTAMP,
    CONSTRAINT "FK_SuscripcionLicencias_Suscripcion" FOREIGN KEY ("IdSuscripcion") REFERENCES "Suscripciones" ("IdSuscripcion") ON DELETE CASCADE
);

CREATE TABLE "ComercialAuditoria" (
    "IdAuditoria" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Accion" VARCHAR(80) NOT NULL,
    "Entidad" VARCHAR(80) NOT NULL,
    "IdEntidad" INTEGER,
    "IdAgente" INTEGER,
    "Payload" JSONB,
    "Ip" VARCHAR(80),
    "UserAgent" VARCHAR(255),
    "Fecha" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_ComercialAuditoria_Agente" FOREIGN KEY ("IdAgente") REFERENCES "ComercialAgentes" ("IdAgente")
);

CREATE INDEX "IX_ComercialAuditoria_Entidad" ON "ComercialAuditoria" ("Entidad", "IdEntidad");
CREATE INDEX "IX_ComercialAuditoria_Fecha" ON "ComercialAuditoria" ("Fecha");
