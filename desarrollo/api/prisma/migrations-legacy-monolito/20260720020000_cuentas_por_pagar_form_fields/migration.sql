-- AlterTable
ALTER TABLE "CuentasPorPagar" ADD COLUMN "Moneda" TEXT NOT NULL DEFAULT 'RD$';
ALTER TABLE "CuentasPorPagar" ADD COLUMN "Categoria" TEXT;
ALTER TABLE "CuentasPorPagar" ADD COLUMN "MetodoPagoEsperado" TEXT;
ALTER TABLE "CuentasPorPagar" ADD COLUMN "Prioridad" TEXT NOT NULL DEFAULT 'Media';
ALTER TABLE "CuentasPorPagar" ADD COLUMN "RecordarAntesVencimiento" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CuentasPorPagar" ADD COLUMN "DiasRecordatorio" INTEGER;
ALTER TABLE "CuentasPorPagar" ADD COLUMN "AdjuntoFactura" TEXT;
