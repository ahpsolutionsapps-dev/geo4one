-- Permite ocultar módulos del menú y del catálogo de roles (flag de desarrollador).
ALTER TABLE "Modulos"
ADD COLUMN "Oculto" BOOLEAN NOT NULL DEFAULT false;
