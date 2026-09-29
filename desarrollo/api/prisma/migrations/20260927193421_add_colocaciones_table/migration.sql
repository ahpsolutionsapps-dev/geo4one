-- CreateTable
CREATE TABLE "Colocaciones" (
    "IdColocacion" BIGSERIAL NOT NULL,
    "CodigoSeguimiento" VARCHAR(50) NOT NULL,
    "IdElemento" BIGINT NOT NULL,
    "IdVersionCampana" BIGINT NOT NULL,
    "IdPeriodoColocacion" BIGINT NOT NULL,
    "Observaciones" TEXT,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Anulado" BOOLEAN NOT NULL DEFAULT false,
    "AnuladoPor" BIGINT,
    "ComentarioAnulado" VARCHAR(500),
    "FechaAnulacion" TIMESTAMPTZ(6),
    "FechaCreacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaActualizacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreadoPor" BIGINT,
    "ActualizadoPor" BIGINT,

    CONSTRAINT "Colocaciones_pkey" PRIMARY KEY ("IdColocacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_Colocaciones_CodigoSeguimiento" ON "Colocaciones"("CodigoSeguimiento");

-- CreateIndex
CREATE INDEX "IX_Colocaciones_IdElemento" ON "Colocaciones"("IdElemento");

-- CreateIndex
CREATE INDEX "IX_Colocaciones_IdVersionCampana" ON "Colocaciones"("IdVersionCampana");

-- CreateIndex
CREATE INDEX "IX_Colocaciones_IdPeriodoColocacion" ON "Colocaciones"("IdPeriodoColocacion");

-- AddForeignKey
ALTER TABLE "Colocaciones" ADD CONSTRAINT "FK_Colocaciones_Elementos" FOREIGN KEY ("IdElemento") REFERENCES "Elementos"("IdElemento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Colocaciones" ADD CONSTRAINT "FK_Colocaciones_VersionesCampanas" FOREIGN KEY ("IdVersionCampana") REFERENCES "VersionesCampanas"("IdVersionCampana") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Colocaciones" ADD CONSTRAINT "FK_Colocaciones_PeriodosColocacion" FOREIGN KEY ("IdPeriodoColocacion") REFERENCES "PeriodosColocacion"("IdPeriodoColocacion") ON DELETE NO ACTION ON UPDATE NO ACTION;
