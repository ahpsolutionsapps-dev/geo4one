-- AlterTable
ALTER TABLE "Modulos" ADD COLUMN "Codigo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IX_Modulos_Codigo" ON "Modulos"("Codigo");
