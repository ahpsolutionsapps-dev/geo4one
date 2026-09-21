-- Módulo de tareas: plantillas, asignaciones y completaciones diarias

CREATE TABLE "Tareas" (
    "IdTarea" SERIAL NOT NULL,
    "Uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "Titulo" VARCHAR(200) NOT NULL,
    "Descripcion" TEXT,
    "Recurrencia" VARCHAR(20) NOT NULL,
    "FechaInicio" DATE NOT NULL,
    "FechaFin" DATE,
    "IdNegocio" INTEGER NOT NULL,
    "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP(6),
    "FechaAnulacion" TIMESTAMP(6),
    "Anulado" BOOLEAN NOT NULL DEFAULT false,
    "ComentarioAnulado" TEXT,
    "Version" INTEGER NOT NULL DEFAULT 1,
    "SyncSeq" INTEGER NOT NULL DEFAULT 0,
    "IdUsuarioRegistra" INTEGER NOT NULL,
    "IdUsuarioModifica" INTEGER,
    "IdUsuarioAnula" INTEGER,

    CONSTRAINT "Tareas_pkey" PRIMARY KEY ("IdTarea")
);

CREATE UNIQUE INDEX "IX_Tareas_Uuid" ON "Tareas"("Uuid");
CREATE INDEX "IDX_Tareas_SyncSeq" ON "Tareas"("SyncSeq");

CREATE TABLE "TareasAsignaciones" (
    "IdTareaAsignacion" SERIAL NOT NULL,
    "IdTarea" INTEGER NOT NULL,
    "IdUsuario" INTEGER NOT NULL,

    CONSTRAINT "TareasAsignaciones_pkey" PRIMARY KEY ("IdTareaAsignacion")
);

CREATE TABLE "TareasCompletaciones" (
    "IdTareaCompletacion" SERIAL NOT NULL,
    "IdTarea" INTEGER NOT NULL,
    "IdUsuario" INTEGER NOT NULL,
    "Fecha" DATE NOT NULL,
    "Completada" BOOLEAN NOT NULL DEFAULT true,
    "FechaCompletada" TIMESTAMP(6),
    "IdUsuarioCompleta" INTEGER,

    CONSTRAINT "TareasCompletaciones_pkey" PRIMARY KEY ("IdTareaCompletacion")
);

CREATE INDEX "IX_Tareas_IdNegocio" ON "Tareas"("IdNegocio");
CREATE INDEX "IX_Tareas_Anulado" ON "Tareas"("Anulado");
CREATE INDEX "IX_Tareas_FechaInicio" ON "Tareas"("FechaInicio");

CREATE UNIQUE INDEX "UQ_TareasAsignaciones_TareaUsuario" ON "TareasAsignaciones"("IdTarea", "IdUsuario");
CREATE INDEX "IX_TareasAsignaciones_IdUsuario" ON "TareasAsignaciones"("IdUsuario");

CREATE UNIQUE INDEX "UQ_TareasCompletaciones_TareaUsuarioFecha" ON "TareasCompletaciones"("IdTarea", "IdUsuario", "Fecha");
CREATE INDEX "IX_TareasCompletaciones_UsuarioFecha" ON "TareasCompletaciones"("IdUsuario", "Fecha");

ALTER TABLE "Tareas"
    ADD CONSTRAINT "FK_Tareas_Negocio"
    FOREIGN KEY ("IdNegocio") REFERENCES "Negocios"("IdNegocio") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Tareas"
    ADD CONSTRAINT "FK_Tareas_UsuarioRegistra"
    FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Tareas"
    ADD CONSTRAINT "FK_Tareas_UsuarioModifica"
    FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "Tareas"
    ADD CONSTRAINT "FK_Tareas_UsuarioAnula"
    FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "TareasAsignaciones"
    ADD CONSTRAINT "FK_TareasAsignaciones_Tarea"
    FOREIGN KEY ("IdTarea") REFERENCES "Tareas"("IdTarea") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "TareasAsignaciones"
    ADD CONSTRAINT "FK_TareasAsignaciones_Usuario"
    FOREIGN KEY ("IdUsuario") REFERENCES "Usuarios"("IdUsuario") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "TareasCompletaciones"
    ADD CONSTRAINT "FK_TareasCompletaciones_Tarea"
    FOREIGN KEY ("IdTarea") REFERENCES "Tareas"("IdTarea") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "TareasCompletaciones"
    ADD CONSTRAINT "FK_TareasCompletaciones_Usuario"
    FOREIGN KEY ("IdUsuario") REFERENCES "Usuarios"("IdUsuario") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "TareasCompletaciones"
    ADD CONSTRAINT "FK_TareasCompletaciones_UsuarioCompleta"
    FOREIGN KEY ("IdUsuarioCompleta") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Menú: Mis tareas y Gestionar tareas (hijos de Principal)
INSERT INTO "Modulos" (
    "IdModulo", "Codigo", "NombreModulo", "Icono", "Ruta", "IdPadre", "OrderIndex"
) OVERRIDING SYSTEM VALUE VALUES
(50, 'mis_tareas', 'Mis tareas', 'tasks', '/tareas', 2, 5),
(51, 'gestionar_tareas', 'Gestionar tareas', 'tasks_manage', '/tareas/gestionar', 2, 6)
ON CONFLICT ("IdModulo") DO UPDATE SET
    "Codigo" = EXCLUDED."Codigo",
    "NombreModulo" = EXCLUDED."NombreModulo",
    "Icono" = EXCLUDED."Icono",
    "Ruta" = EXCLUDED."Ruta",
    "IdPadre" = EXCLUDED."IdPadre",
    "OrderIndex" = EXCLUDED."OrderIndex";

-- Vendedor: solo Mis tareas
INSERT INTO "RolModulos" ("IdRol", "IdModulo")
SELECT 2, 50
WHERE NOT EXISTS (
    SELECT 1 FROM "RolModulos" rm WHERE rm."IdRol" = 2 AND rm."IdModulo" = 50
);

-- Administrador: Mis tareas + Gestionar tareas
INSERT INTO "RolModulos" ("IdRol", "IdModulo")
SELECT v."IdRol", v."IdModulo"
FROM (
    VALUES (3, 50), (3, 51)
) AS v("IdRol", "IdModulo")
WHERE NOT EXISTS (
    SELECT 1
    FROM "RolModulos" rm
    WHERE rm."IdRol" = v."IdRol"
      AND rm."IdModulo" = v."IdModulo"
);

-- Super Administrador: todos los módulos visibles
INSERT INTO "RolModulos" ("IdRol", "IdModulo")
SELECT 1, m."IdModulo"
FROM "Modulos" m
WHERE m."Oculto" = FALSE
  AND NOT EXISTS (
    SELECT 1
    FROM "RolModulos" rm
    WHERE rm."IdRol" = 1
      AND rm."IdModulo" = m."IdModulo"
);

SELECT setval(
    pg_get_serial_sequence('"Modulos"', 'IdModulo'),
    COALESCE((SELECT MAX("IdModulo") FROM "Modulos"), 1),
    true
);
