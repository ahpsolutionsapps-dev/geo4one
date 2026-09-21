-- Chat interno, grupos y atención a clientes.

CREATE TABLE IF NOT EXISTS "ChatConversaciones" (
    "IdConversacion" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "IdNegocio" INTEGER NOT NULL,
    "Tipo" VARCHAR(20) NOT NULL,
    "Nombre" VARCHAR(150),
    "IdCliente" INTEGER,
    "ClaveUnica" VARCHAR(80),
    "UltimoMensaje" TEXT,
    "FechaUltimoMensaje" TIMESTAMP,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "ComentarioAnulado" TEXT,
    "IdUsuarioRegistra" INTEGER NOT NULL,
    "IdUsuarioModifica" INTEGER,
    "IdUsuarioAnula" INTEGER,
    CONSTRAINT "UQ_ChatConversaciones_Uuid" UNIQUE ("Uuid"),
    CONSTRAINT "CK_ChatConversaciones_Tipo" CHECK ("Tipo" IN ('directo', 'grupo', 'cliente')),
    CONSTRAINT "FK_ChatConversaciones_Negocios" FOREIGN KEY ("IdNegocio") REFERENCES "Negocios" ("IdNegocio"),
    CONSTRAINT "FK_ChatConversaciones_Clientes" FOREIGN KEY ("IdCliente") REFERENCES "Clientes" ("IdCliente"),
    CONSTRAINT "FK_ChatConversaciones_UsuarioRegistra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios" ("IdUsuario"),
    CONSTRAINT "FK_ChatConversaciones_UsuarioModifica" FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios" ("IdUsuario"),
    CONSTRAINT "FK_ChatConversaciones_UsuarioAnula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios" ("IdUsuario")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_ChatConversaciones_Negocio_Clave"
ON "ChatConversaciones" ("IdNegocio", "ClaveUnica")
WHERE "ClaveUnica" IS NOT NULL AND "Anulado" = FALSE;

CREATE INDEX IF NOT EXISTS "IX_ChatConversaciones_IdNegocio"
ON "ChatConversaciones" ("IdNegocio");

CREATE INDEX IF NOT EXISTS "IX_ChatConversaciones_IdCliente"
ON "ChatConversaciones" ("IdCliente");

CREATE INDEX IF NOT EXISTS "IX_ChatConversaciones_FechaUltimoMensaje"
ON "ChatConversaciones" ("FechaUltimoMensaje" DESC);

CREATE TABLE IF NOT EXISTS "ChatParticipantes" (
    "IdParticipante" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "IdConversacion" INTEGER NOT NULL,
    "Tipo" VARCHAR(20) NOT NULL,
    "IdUsuario" INTEGER,
    "IdCliente" INTEGER,
    "Silenciado" BOOLEAN NOT NULL DEFAULT FALSE,
    "Destacado" BOOLEAN NOT NULL DEFAULT FALSE,
    "FechaUltimaLectura" TIMESTAMP,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "IdUsuarioRegistra" INTEGER NOT NULL,
    "IdUsuarioAnula" INTEGER,
    CONSTRAINT "CK_ChatParticipantes_Tipo" CHECK ("Tipo" IN ('usuario', 'cliente')),
    CONSTRAINT "CK_ChatParticipantes_Identidad" CHECK (
        ("Tipo" = 'usuario' AND "IdUsuario" IS NOT NULL AND "IdCliente" IS NULL)
        OR ("Tipo" = 'cliente' AND "IdCliente" IS NOT NULL AND "IdUsuario" IS NULL)
    ),
    CONSTRAINT "FK_ChatParticipantes_Conversacion" FOREIGN KEY ("IdConversacion") REFERENCES "ChatConversaciones" ("IdConversacion") ON DELETE CASCADE,
    CONSTRAINT "FK_ChatParticipantes_Usuarios" FOREIGN KEY ("IdUsuario") REFERENCES "Usuarios" ("IdUsuario"),
    CONSTRAINT "FK_ChatParticipantes_Clientes" FOREIGN KEY ("IdCliente") REFERENCES "Clientes" ("IdCliente"),
    CONSTRAINT "FK_ChatParticipantes_UsuarioRegistra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios" ("IdUsuario"),
    CONSTRAINT "FK_ChatParticipantes_UsuarioAnula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios" ("IdUsuario")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_ChatParticipantes_Conversacion_Usuario"
ON "ChatParticipantes" ("IdConversacion", "IdUsuario")
WHERE "IdUsuario" IS NOT NULL AND "Anulado" = FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_ChatParticipantes_Conversacion_Cliente"
ON "ChatParticipantes" ("IdConversacion", "IdCliente")
WHERE "IdCliente" IS NOT NULL AND "Anulado" = FALSE;

CREATE INDEX IF NOT EXISTS "IX_ChatParticipantes_IdUsuario"
ON "ChatParticipantes" ("IdUsuario");

CREATE TABLE IF NOT EXISTS "ChatMensajes" (
    "IdMensaje" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "IdConversacion" INTEGER NOT NULL,
    "IdUsuarioRemitente" INTEGER,
    "IdClienteRemitente" INTEGER,
    "Contenido" TEXT NOT NULL,
    "FechaCreacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaAnulacion" TIMESTAMP,
    "Anulado" BOOLEAN NOT NULL DEFAULT FALSE,
    "ComentarioAnulado" TEXT,
    "IdUsuarioRegistra" INTEGER NOT NULL,
    "IdUsuarioAnula" INTEGER,
    CONSTRAINT "UQ_ChatMensajes_Uuid" UNIQUE ("Uuid"),
    CONSTRAINT "CK_ChatMensajes_Remitente" CHECK (
        ("IdUsuarioRemitente" IS NOT NULL AND "IdClienteRemitente" IS NULL)
        OR ("IdClienteRemitente" IS NOT NULL AND "IdUsuarioRemitente" IS NULL)
    ),
    CONSTRAINT "FK_ChatMensajes_Conversacion" FOREIGN KEY ("IdConversacion") REFERENCES "ChatConversaciones" ("IdConversacion") ON DELETE CASCADE,
    CONSTRAINT "FK_ChatMensajes_UsuarioRemitente" FOREIGN KEY ("IdUsuarioRemitente") REFERENCES "Usuarios" ("IdUsuario"),
    CONSTRAINT "FK_ChatMensajes_ClienteRemitente" FOREIGN KEY ("IdClienteRemitente") REFERENCES "Clientes" ("IdCliente"),
    CONSTRAINT "FK_ChatMensajes_UsuarioRegistra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios" ("IdUsuario"),
    CONSTRAINT "FK_ChatMensajes_UsuarioAnula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios" ("IdUsuario")
);

CREATE INDEX IF NOT EXISTS "IX_ChatMensajes_Conversacion_Fecha"
ON "ChatMensajes" ("IdConversacion", "FechaCreacion" DESC);

INSERT INTO "Permisos" ("Permiso", "Descripcion", "IdUsuarioRegistra")
SELECT
    'chat.atender_clientes',
    'Permite atender conversaciones 1 a 1 con clientes',
    1
WHERE NOT EXISTS (
    SELECT 1
    FROM "Permisos"
    WHERE "Permiso" = 'chat.atender_clientes'
      AND "Anulado" = FALSE
);

INSERT INTO "RolPermisos" ("IdRol", "IdPermiso")
SELECT 1, p."IdPermiso"
FROM "Permisos" p
WHERE p."Permiso" = 'chat.atender_clientes'
  AND p."Anulado" = FALSE
  AND NOT EXISTS (
      SELECT 1
      FROM "RolPermisos" rp
      WHERE rp."IdRol" = 1
        AND rp."IdPermiso" = p."IdPermiso"
  );
