CREATE SEQUENCE IF NOT EXISTS "Cotizaciones_SyncSeq";
CREATE SEQUENCE IF NOT EXISTS "Devoluciones_SyncSeq";
CREATE SEQUENCE IF NOT EXISTS "Cancelaciones_SyncSeq";

CREATE TABLE IF NOT EXISTS "Cotizaciones" (
  "IdCotizacion" SERIAL PRIMARY KEY,
  "NumeroCotizacion" VARCHAR(50) NOT NULL UNIQUE,
  "FechaCotizacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "FechaVencimiento" TIMESTAMP(6),
  "IdCliente" INTEGER NOT NULL,
  "IdVenta" INTEGER,
  "Observaciones" TEXT,
  "Estado" VARCHAR(30) NOT NULL DEFAULT 'Borrador',
  "SubTotal" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "Descuento" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "Itbis" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "Total" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "FechaModificacion" TIMESTAMP(6),
  "FechaAnulacion" TIMESTAMP(6),
  "Anulado" BOOLEAN NOT NULL DEFAULT false,
  "ComentarioAnulado" TEXT,
  "IdUsuarioRegistra" INTEGER NOT NULL,
  "IdUsuarioModifica" INTEGER,
  "IdUsuarioAnula" INTEGER,
  "Uuid" UUID,
  "Version" INTEGER NOT NULL DEFAULT 1,
  "SyncSeq" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "FK_Cotizaciones_Cliente" FOREIGN KEY ("IdCliente") REFERENCES "Clientes"("IdCliente"),
  CONSTRAINT "FK_Cotizaciones_Venta" FOREIGN KEY ("IdVenta") REFERENCES "Ventas"("IdVenta"),
  CONSTRAINT "FK_Cotizaciones_UsuarioRegistra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios"("IdUsuario"),
  CONSTRAINT "FK_Cotizaciones_UsuarioModifica" FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios"("IdUsuario"),
  CONSTRAINT "FK_Cotizaciones_UsuarioAnula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios"("IdUsuario")
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Cotizaciones_Uuid" ON "Cotizaciones"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Cotizaciones_SyncSeq" ON "Cotizaciones"("SyncSeq");
CREATE INDEX IF NOT EXISTS "IX_Cotizaciones_IdCliente" ON "Cotizaciones"("IdCliente");
CREATE INDEX IF NOT EXISTS "IX_Cotizaciones_Fecha" ON "Cotizaciones"("FechaCotizacion");

CREATE TABLE IF NOT EXISTS "CotizacionesDetalle" (
  "IdCotizacionDetalle" SERIAL PRIMARY KEY,
  "IdCotizacion" INTEGER NOT NULL,
  "IdProducto" INTEGER NOT NULL,
  "Cantidad" DECIMAL(18, 2) NOT NULL,
  "PrecioUnitario" DECIMAL(18, 2) NOT NULL,
  "PorcentajeDescuento" DECIMAL(5, 2) NOT NULL DEFAULT 0,
  "PorcentajeItbis" DECIMAL(5, 2) NOT NULL DEFAULT 18.00,
  "SubTotal" DECIMAL(18, 2) NOT NULL,
  "Itbis" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "Total" DECIMAL(18, 2) NOT NULL,
  CONSTRAINT "FK_CotizacionesDetalle_Cotizacion" FOREIGN KEY ("IdCotizacion") REFERENCES "Cotizaciones"("IdCotizacion") ON DELETE CASCADE,
  CONSTRAINT "FK_CotizacionesDetalle_Producto" FOREIGN KEY ("IdProducto") REFERENCES "Productos"("IdProducto")
);

CREATE INDEX IF NOT EXISTS "IX_CotizacionesDetalle_IdCotizacion" ON "CotizacionesDetalle"("IdCotizacion");

CREATE TABLE IF NOT EXISTS "Devoluciones" (
  "IdDevolucion" SERIAL PRIMARY KEY,
  "NumeroDevolucion" VARCHAR(50) NOT NULL UNIQUE,
  "FechaDevolucion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "IdVenta" INTEGER NOT NULL,
  "IdCliente" INTEGER NOT NULL,
  "Motivo" TEXT,
  "Observaciones" TEXT,
  "Estado" VARCHAR(30) NOT NULL DEFAULT 'Borrador',
  "SubTotal" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "Itbis" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "Total" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "FechaModificacion" TIMESTAMP(6),
  "FechaAnulacion" TIMESTAMP(6),
  "Anulado" BOOLEAN NOT NULL DEFAULT false,
  "ComentarioAnulado" TEXT,
  "IdUsuarioRegistra" INTEGER NOT NULL,
  "IdUsuarioModifica" INTEGER,
  "IdUsuarioAnula" INTEGER,
  "Uuid" UUID,
  "Version" INTEGER NOT NULL DEFAULT 1,
  "SyncSeq" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "FK_Devoluciones_Venta" FOREIGN KEY ("IdVenta") REFERENCES "Ventas"("IdVenta"),
  CONSTRAINT "FK_Devoluciones_Cliente" FOREIGN KEY ("IdCliente") REFERENCES "Clientes"("IdCliente"),
  CONSTRAINT "FK_Devoluciones_UsuarioRegistra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios"("IdUsuario"),
  CONSTRAINT "FK_Devoluciones_UsuarioModifica" FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios"("IdUsuario"),
  CONSTRAINT "FK_Devoluciones_UsuarioAnula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios"("IdUsuario")
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Devoluciones_Uuid" ON "Devoluciones"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Devoluciones_SyncSeq" ON "Devoluciones"("SyncSeq");
CREATE INDEX IF NOT EXISTS "IX_Devoluciones_IdVenta" ON "Devoluciones"("IdVenta");
CREATE INDEX IF NOT EXISTS "IX_Devoluciones_IdCliente" ON "Devoluciones"("IdCliente");

CREATE TABLE IF NOT EXISTS "DevolucionesDetalle" (
  "IdDevolucionDetalle" SERIAL PRIMARY KEY,
  "IdDevolucion" INTEGER NOT NULL,
  "IdProducto" INTEGER NOT NULL,
  "IdVentaDetalle" INTEGER,
  "CantidadVendida" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "CantidadDevuelta" DECIMAL(18, 2) NOT NULL,
  "PrecioUnitario" DECIMAL(18, 2) NOT NULL,
  "PorcentajeItbis" DECIMAL(5, 2) NOT NULL DEFAULT 18.00,
  "SubTotal" DECIMAL(18, 2) NOT NULL,
  "Itbis" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "Total" DECIMAL(18, 2) NOT NULL,
  CONSTRAINT "FK_DevolucionesDetalle_Devolucion" FOREIGN KEY ("IdDevolucion") REFERENCES "Devoluciones"("IdDevolucion") ON DELETE CASCADE,
  CONSTRAINT "FK_DevolucionesDetalle_Producto" FOREIGN KEY ("IdProducto") REFERENCES "Productos"("IdProducto")
);

CREATE INDEX IF NOT EXISTS "IX_DevolucionesDetalle_IdDevolucion" ON "DevolucionesDetalle"("IdDevolucion");

CREATE TABLE IF NOT EXISTS "Cancelaciones" (
  "IdCancelacion" SERIAL PRIMARY KEY,
  "NumeroCancelacion" VARCHAR(50) NOT NULL UNIQUE,
  "FechaCancelacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "IdVenta" INTEGER NOT NULL,
  "IdCliente" INTEGER NOT NULL,
  "Motivo" TEXT,
  "Observaciones" TEXT,
  "Estado" VARCHAR(30) NOT NULL DEFAULT 'Borrador',
  "SubTotal" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "Itbis" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "Total" DECIMAL(18, 2) NOT NULL DEFAULT 0,
  "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "FechaModificacion" TIMESTAMP(6),
  "FechaAnulacion" TIMESTAMP(6),
  "Anulado" BOOLEAN NOT NULL DEFAULT false,
  "ComentarioAnulado" TEXT,
  "IdUsuarioRegistra" INTEGER NOT NULL,
  "IdUsuarioModifica" INTEGER,
  "IdUsuarioAnula" INTEGER,
  "Uuid" UUID,
  "Version" INTEGER NOT NULL DEFAULT 1,
  "SyncSeq" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "FK_Cancelaciones_Venta" FOREIGN KEY ("IdVenta") REFERENCES "Ventas"("IdVenta"),
  CONSTRAINT "FK_Cancelaciones_Cliente" FOREIGN KEY ("IdCliente") REFERENCES "Clientes"("IdCliente"),
  CONSTRAINT "FK_Cancelaciones_UsuarioRegistra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios"("IdUsuario"),
  CONSTRAINT "FK_Cancelaciones_UsuarioModifica" FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios"("IdUsuario"),
  CONSTRAINT "FK_Cancelaciones_UsuarioAnula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios"("IdUsuario")
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Cancelaciones_Uuid" ON "Cancelaciones"("Uuid");
CREATE INDEX IF NOT EXISTS "IDX_Cancelaciones_SyncSeq" ON "Cancelaciones"("SyncSeq");
CREATE INDEX IF NOT EXISTS "IX_Cancelaciones_IdVenta" ON "Cancelaciones"("IdVenta");
CREATE INDEX IF NOT EXISTS "IX_Cancelaciones_IdCliente" ON "Cancelaciones"("IdCliente");
