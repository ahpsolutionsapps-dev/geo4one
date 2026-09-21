-- CreateTable
CREATE TABLE "Negocios" (
    "IdNegocio" SERIAL NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "RNC" VARCHAR(20),
    "Direccion" TEXT,
    "Telefono" VARCHAR(30),
    "Email" VARCHAR(150),
    "FechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP(3),
    "FechaAnulacion" TIMESTAMP(3),
    "Anulado" BOOLEAN NOT NULL DEFAULT false,
    "ComentarioAnulado" TEXT,
    "IdUsuarioRegistra" INTEGER NOT NULL,
    "IdUsuarioModifica" INTEGER,
    "IdUsuarioAnula" INTEGER,
    CONSTRAINT "Negocios_pkey" PRIMARY KEY ("IdNegocio")
);

INSERT INTO "Negocios" ("Nombre", "IdUsuarioRegistra")
SELECT 'Negocio principal', COALESCE((SELECT MIN("IdUsuario") FROM "Usuarios"), 1);

ALTER TABLE "Roles" ADD COLUMN "IdNegocio" INTEGER;
UPDATE "Roles" SET "IdNegocio" = 1;
ALTER TABLE "Roles" ALTER COLUMN "IdNegocio" SET NOT NULL;
ALTER TABLE "Roles"
ADD CONSTRAINT "FK_Roles_Negocios"
FOREIGN KEY ("IdNegocio") REFERENCES "Negocios"("IdNegocio")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Usuarios" ADD COLUMN "IdNegocio" INTEGER;
UPDATE "Usuarios" SET "IdNegocio" = 1;
ALTER TABLE "Usuarios" ALTER COLUMN "IdNegocio" SET NOT NULL;
ALTER TABLE "Usuarios"
ADD CONSTRAINT "FK_Usuarios_Negocios"
FOREIGN KEY ("IdNegocio") REFERENCES "Negocios"("IdNegocio")
ON DELETE RESTRICT ON UPDATE CASCADE;
