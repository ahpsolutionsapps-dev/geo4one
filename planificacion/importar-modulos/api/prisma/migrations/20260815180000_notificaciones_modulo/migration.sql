-- CreateTable
CREATE TABLE "Notificaciones" (
    "IdNotificacion" SERIAL NOT NULL,
    "Uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "IdNegocio" INTEGER NOT NULL,
    "IdSucursal" INTEGER,
    "TipoEvento" VARCHAR(80) NOT NULL,
    "TipoNotificacion" VARCHAR(30) NOT NULL,
    "Prioridad" VARCHAR(20) NOT NULL,
    "Titulo" VARCHAR(200) NOT NULL,
    "Mensaje" TEXT NOT NULL,
    "Entidad" VARCHAR(80) NOT NULL,
    "IdEntidad" INTEGER NOT NULL,
    "Metadata" JSONB,
    "RequiereAccion" BOOLEAN NOT NULL DEFAULT false,
    "IdUsuarioOrigen" INTEGER,
    "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificaciones_pkey" PRIMARY KEY ("IdNotificacion")
);

-- CreateTable
CREATE TABLE "NotificacionesUsuarios" (
    "IdNotificacionUsuario" SERIAL NOT NULL,
    "IdNotificacion" INTEGER NOT NULL,
    "IdUsuario" INTEGER NOT NULL,
    "Leida" BOOLEAN NOT NULL DEFAULT false,
    "FechaLectura" TIMESTAMP(6),
    "Archivada" BOOLEAN NOT NULL DEFAULT false,
    "FechaArchivada" TIMESTAMP(6),

    CONSTRAINT "NotificacionesUsuarios_pkey" PRIMARY KEY ("IdNotificacionUsuario")
);

-- CreateTable
CREATE TABLE "ReglasNotificaciones" (
    "IdRegla" SERIAL NOT NULL,
    "IdNegocio" INTEGER,
    "TipoEvento" VARCHAR(80) NOT NULL,
    "Activa" BOOLEAN NOT NULL DEFAULT true,
    "Prioridad" VARCHAR(20) NOT NULL,
    "TipoNotificacion" VARCHAR(30) NOT NULL,
    "DestinatariosRoles" JSONB NOT NULL,
    "Condiciones" JSONB,
    "Canales" JSONB NOT NULL,
    "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReglasNotificaciones_pkey" PRIMARY KEY ("IdRegla")
);

-- CreateTable
CREATE TABLE "PreferenciasNotificaciones" (
    "IdPreferencia" SERIAL NOT NULL,
    "IdUsuario" INTEGER NOT NULL,
    "TipoEvento" VARCHAR(80) NOT NULL,
    "Canal" VARCHAR(30) NOT NULL,
    "Habilitada" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PreferenciasNotificaciones_pkey" PRIMARY KEY ("IdPreferencia")
);

-- CreateTable
CREATE TABLE "NotificacionesIdempotencia" (
    "ClaveIdempotencia" VARCHAR(200) NOT NULL,
    "IdNotificacion" INTEGER NOT NULL,
    "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificacionesIdempotencia_pkey" PRIMARY KEY ("ClaveIdempotencia")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notificaciones_Uuid_key" ON "Notificaciones"("Uuid");

-- CreateIndex
CREATE INDEX "IX_Notificaciones_Negocio_Fecha" ON "Notificaciones"("IdNegocio", "FechaCreacion");

-- CreateIndex
CREATE INDEX "IX_Notificaciones_Evento_Entidad" ON "Notificaciones"("TipoEvento", "IdEntidad");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_NotificacionesUsuarios_Notificacion_Usuario" ON "NotificacionesUsuarios"("IdNotificacion", "IdUsuario");

-- CreateIndex
CREATE INDEX "IX_NotificacionesUsuarios_Usuario_Leida" ON "NotificacionesUsuarios"("IdUsuario", "Leida");

-- CreateIndex
CREATE INDEX "IX_ReglasNotificaciones_Negocio_Evento" ON "ReglasNotificaciones"("IdNegocio", "TipoEvento", "Activa");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_PreferenciasNotificaciones_Usuario_Evento_Canal" ON "PreferenciasNotificaciones"("IdUsuario", "TipoEvento", "Canal");

-- CreateIndex
CREATE INDEX "IX_NotificacionesIdempotencia_Fecha" ON "NotificacionesIdempotencia"("FechaCreacion");

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "FK_Notificaciones_Negocio" FOREIGN KEY ("IdNegocio") REFERENCES "Negocios"("IdNegocio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "FK_Notificaciones_Sucursal" FOREIGN KEY ("IdSucursal") REFERENCES "Sucursales"("IdSucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "FK_Notificaciones_UsuarioOrigen" FOREIGN KEY ("IdUsuarioOrigen") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NotificacionesUsuarios" ADD CONSTRAINT "FK_NotificacionesUsuarios_Notificacion" FOREIGN KEY ("IdNotificacion") REFERENCES "Notificaciones"("IdNotificacion") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NotificacionesUsuarios" ADD CONSTRAINT "FK_NotificacionesUsuarios_Usuario" FOREIGN KEY ("IdUsuario") REFERENCES "Usuarios"("IdUsuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReglasNotificaciones" ADD CONSTRAINT "FK_ReglasNotificaciones_Negocio" FOREIGN KEY ("IdNegocio") REFERENCES "Negocios"("IdNegocio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PreferenciasNotificaciones" ADD CONSTRAINT "FK_PreferenciasNotificaciones_Usuario" FOREIGN KEY ("IdUsuario") REFERENCES "Usuarios"("IdUsuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Seed reglas globales por defecto
INSERT INTO "ReglasNotificaciones" ("IdNegocio", "TipoEvento", "Activa", "Prioridad", "TipoNotificacion", "DestinatariosRoles", "Condiciones", "Canales")
VALUES
  (NULL, 'StockBajo', true, 'ALTA', 'ADVERTENCIA', '["Administrador"]', NULL, '["IN_APP"]'),
  (NULL, 'ProductoAgotado', true, 'ALTA', 'ADVERTENCIA', '["Administrador"]', NULL, '["IN_APP"]'),
  (NULL, 'AjusteInventarioRealizado', true, 'MEDIA', 'INFORMATIVA', '["Administrador"]', '{"cantidadMinima": 10}', '["IN_APP"]'),
  (NULL, 'OrdenCompraCreada', true, 'MEDIA', 'INFORMATIVA', '["Administrador"]', NULL, '["IN_APP"]'),
  (NULL, 'VentaCancelada', true, 'ALTA', 'ADVERTENCIA', '["Administrador"]', NULL, '["IN_APP"]'),
  (NULL, 'VentaMontoElevado', true, 'MEDIA', 'INFORMATIVA', '["Administrador", "Super Administrador"]', '{"totalMinimo": 100000}', '["IN_APP"]'),
  (NULL, 'CuentaPorCobrarProximaVencer', true, 'MEDIA', 'ADVERTENCIA', '["Administrador"]', '{"diasAnticipacion": 3}', '["IN_APP"]'),
  (NULL, 'CuentaPorCobrarVencida', true, 'ALTA', 'ADVERTENCIA', '["Administrador"]', NULL, '["IN_APP"]'),
  (NULL, 'CuentaPorPagarProximaVencer', true, 'MEDIA', 'ADVERTENCIA', '["Administrador"]', '{"diasAnticipacion": 5}', '["IN_APP"]'),
  (NULL, 'CuentaPorPagarVencida', true, 'ALTA', 'ADVERTENCIA', '["Administrador"]', NULL, '["IN_APP"]'),
  (NULL, 'CobroClienteRegistrado', true, 'BAJA', 'INFORMATIVA', '["Administrador"]', NULL, '["IN_APP"]'),
  (NULL, 'PagoProveedorRegistrado', true, 'BAJA', 'INFORMATIVA', '["Administrador"]', NULL, '["IN_APP"]');
