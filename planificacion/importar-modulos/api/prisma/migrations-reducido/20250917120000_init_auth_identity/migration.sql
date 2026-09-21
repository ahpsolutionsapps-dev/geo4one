-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Modulos" (
    "IdModulo" SERIAL NOT NULL,
    "NombreModulo" TEXT NOT NULL,
    "Icono" TEXT,
    "Ruta" TEXT,
    "IdPadre" INTEGER,
    "OrderIndex" INTEGER DEFAULT 0,
    "Codigo" TEXT,
    "Oculto" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Modulos_pkey" PRIMARY KEY ("IdModulo")
);

-- CreateTable
CREATE TABLE "Negocios" (
    "IdNegocio" SERIAL NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "RNC" VARCHAR(20),
    "Direccion" TEXT,
    "Telefono" VARCHAR(30),
    "Email" VARCHAR(150),
    "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP(6),
    "FechaAnulacion" TIMESTAMP(6),
    "Anulado" BOOLEAN NOT NULL DEFAULT false,
    "ComentarioAnulado" TEXT,
    "IdUsuarioRegistra" INTEGER NOT NULL,
    "IdUsuarioModifica" INTEGER,
    "IdUsuarioAnula" INTEGER,

    CONSTRAINT "Negocios_pkey" PRIMARY KEY ("IdNegocio")
);

-- CreateTable
CREATE TABLE "Roles" (
    "IdRol" SERIAL NOT NULL,
    "IdNegocio" INTEGER NOT NULL,
    "Rol" VARCHAR(100) NOT NULL,
    "Descripcion" TEXT NOT NULL,
    "IdUsuarioRegistra" INTEGER,
    "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "IdUsuarioModifica" INTEGER,
    "FechaModificacion" TIMESTAMP(6),
    "Anulado" BOOLEAN NOT NULL DEFAULT false,
    "IdUsuarioAnula" INTEGER,
    "FechaAnulado" TIMESTAMP(6),
    "Comentario" TEXT,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("IdRol")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "IdUsuario" SERIAL NOT NULL,
    "IdNegocio" INTEGER NOT NULL,
    "IdRol" INTEGER,
    "Username" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(150) NOT NULL,
    "Userpassword" TEXT NOT NULL,
    "Nombre" VARCHAR(100) NOT NULL,
    "Apellido" VARCHAR(100),
    "Telefono" VARCHAR(30),
    "PalabraSecreta" VARCHAR(255),
    "Habilitado" BOOLEAN NOT NULL DEFAULT true,
    "Verificado" BOOLEAN NOT NULL DEFAULT false,
    "Estatus" SMALLINT NOT NULL DEFAULT 1,
    "Imagen" TEXT,
    "PrimaryColor" VARCHAR(30),
    "Idioma" VARCHAR(10) NOT NULL DEFAULT 'es',
    "Tema" VARCHAR(20) NOT NULL DEFAULT 'sistema',
    "IntentosFallidos" SMALLINT NOT NULL DEFAULT 0,
    "UltimoAcceso" TIMESTAMP(6),
    "BloqueadoHasta" TIMESTAMP(6),
    "IdUsuarioRegistra" INTEGER,
    "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "IdUsuarioModifica" INTEGER,
    "FechaModificacion" TIMESTAMP(6),
    "Anulado" BOOLEAN NOT NULL DEFAULT false,
    "IdUsuarioAnula" INTEGER,
    "FechaAnulado" TIMESTAMP(6),
    "Comentario" TEXT,
    "DarkColorScheme" VARCHAR(20) DEFAULT 'cinder',

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("IdUsuario")
);

-- CreateTable
CREATE TABLE "RolModulos" (
    "IdRolModulo" SERIAL NOT NULL,
    "IdRol" INTEGER NOT NULL,
    "IdModulo" INTEGER NOT NULL,

    CONSTRAINT "RolModulos_pkey" PRIMARY KEY ("IdRolModulo")
);

-- CreateTable
CREATE TABLE "QrLoginSessions" (
    "IdQrLoginSession" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "Status" TEXT NOT NULL DEFAULT 'pending',
    "IdUsuario" INTEGER,
    "Token" TEXT,
    "DeviceName" TEXT,
    "ExpiraEn" TIMESTAMP(6) NOT NULL,
    "AprobadoEn" TIMESTAMP(6),
    "ConsumidoEn" TIMESTAMP(6),
    "CreadoEn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrLoginSessions_pkey" PRIMARY KEY ("IdQrLoginSession")
);

-- CreateTable
CREATE TABLE "Sucursales" (
    "IdSucursal" SERIAL NOT NULL,
    "IdNegocio" INTEGER NOT NULL,
    "Nombre" VARCHAR(150) NOT NULL,
    "Direccion" TEXT,
    "Telefono" VARCHAR(30),
    "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP(6),
    "FechaAnulacion" TIMESTAMP(6),
    "Anulado" BOOLEAN NOT NULL DEFAULT false,
    "ComentarioAnulado" TEXT,
    "IdUsuarioRegistra" INTEGER NOT NULL,
    "IdUsuarioModifica" INTEGER,
    "IdUsuarioAnula" INTEGER,

    CONSTRAINT "Sucursales_pkey" PRIMARY KEY ("IdSucursal")
);

-- CreateTable
CREATE TABLE "UsuariosSucursales" (
    "IdUsuarioSucursal" SERIAL NOT NULL,
    "IdUsuario" INTEGER NOT NULL,
    "IdSucursal" INTEGER NOT NULL,
    "EsPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "FechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaModificacion" TIMESTAMP(6),
    "FechaAnulacion" TIMESTAMP(6),
    "Anulado" BOOLEAN NOT NULL DEFAULT false,
    "ComentarioAnulado" TEXT,
    "IdUsuarioRegistra" INTEGER NOT NULL,
    "IdUsuarioModifica" INTEGER,
    "IdUsuarioAnula" INTEGER,

    CONSTRAINT "UsuariosSucursales_pkey" PRIMARY KEY ("IdUsuarioSucursal")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_Username_key" ON "Usuarios"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_UsuarioSucursal" ON "UsuariosSucursales"("IdUsuario", "IdSucursal");

-- AddForeignKey
ALTER TABLE "Modulos" ADD CONSTRAINT "Modulos_IdPadre_fkey" FOREIGN KEY ("IdPadre") REFERENCES "Modulos"("IdModulo") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Negocios" ADD CONSTRAINT "FK_Negocios_Anula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Negocios" ADD CONSTRAINT "FK_Negocios_Modifica" FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Negocios" ADD CONSTRAINT "FK_Negocios_Registra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "FK_Roles_Anula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "FK_Roles_Modifica" FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "FK_Roles_Negocios" FOREIGN KEY ("IdNegocio") REFERENCES "Negocios"("IdNegocio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "FK_Roles_Registra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_Usuarios_Anula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_Usuarios_Modifica" FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_Usuarios_Negocios" FOREIGN KEY ("IdNegocio") REFERENCES "Negocios"("IdNegocio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_Usuarios_Registra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_Usuarios_Roles" FOREIGN KEY ("IdRol") REFERENCES "Roles"("IdRol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolModulos" ADD CONSTRAINT "FK_RolModulos_Modulos" FOREIGN KEY ("IdModulo") REFERENCES "Modulos"("IdModulo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolModulos" ADD CONSTRAINT "FK_RolModulos_Roles" FOREIGN KEY ("IdRol") REFERENCES "Roles"("IdRol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrLoginSessions" ADD CONSTRAINT "QrLoginSessions_IdUsuario_fkey" FOREIGN KEY ("IdUsuario") REFERENCES "Usuarios"("IdUsuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Sucursales" ADD CONSTRAINT "FK_Sucursales_Anula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Sucursales" ADD CONSTRAINT "FK_Sucursales_Modifica" FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Sucursales" ADD CONSTRAINT "FK_Sucursales_Negocios" FOREIGN KEY ("IdNegocio") REFERENCES "Negocios"("IdNegocio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Sucursales" ADD CONSTRAINT "FK_Sucursales_Registra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosSucursales" ADD CONSTRAINT "FK_UsuariosSucursales_Anula" FOREIGN KEY ("IdUsuarioAnula") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosSucursales" ADD CONSTRAINT "FK_UsuariosSucursales_Modifica" FOREIGN KEY ("IdUsuarioModifica") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosSucursales" ADD CONSTRAINT "FK_UsuariosSucursales_Registra" FOREIGN KEY ("IdUsuarioRegistra") REFERENCES "Usuarios"("IdUsuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosSucursales" ADD CONSTRAINT "FK_UsuariosSucursales_Sucursales" FOREIGN KEY ("IdSucursal") REFERENCES "Sucursales"("IdSucursal") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UsuariosSucursales" ADD CONSTRAINT "FK_UsuariosSucursales_Usuarios" FOREIGN KEY ("IdUsuario") REFERENCES "Usuarios"("IdUsuario") ON DELETE CASCADE ON UPDATE NO ACTION;
