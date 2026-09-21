-- Datos mínimos de arranque (después de migrate deploy).
-- Desactiva FKs temporalmente por la dependencia circular Negocio <-> Usuario.

BEGIN;

SET session_replication_role = 'replica';

INSERT INTO "Negocios" (
  "IdNegocio",
  "Nombre",
  "FechaCreacion",
  "Anulado",
  "IdUsuarioRegistra"
)
VALUES (1, 'Mi negocio', NOW(), false, 1)
ON CONFLICT ("IdNegocio") DO NOTHING;

INSERT INTO "Roles" (
  "IdRol",
  "IdNegocio",
  "Rol",
  "Descripcion",
  "Anulado",
  "FechaCreacion"
)
VALUES (1, 1, 'Super Admin', 'Administrador del sistema', false, NOW())
ON CONFLICT ("IdRol") DO NOTHING;

-- Sustituye el hash por uno generado con bcrypt para tu contraseña.
INSERT INTO "Usuarios" (
  "IdUsuario",
  "IdNegocio",
  "IdRol",
  "Username",
  "Email",
  "Userpassword",
  "Nombre",
  "Habilitado",
  "Verificado",
  "Estatus",
  "Anulado",
  "FechaCreacion",
  "IdUsuarioRegistra"
)
VALUES (
  1,
  1,
  1,
  'admin',
  'admin@example.com',
  '$2b$10$REPLACE_WITH_BCRYPT_HASH',
  'Administrador',
  true,
  true,
  1,
  false,
  NOW(),
  1
)
ON CONFLICT ("IdUsuario") DO NOTHING;

SET session_replication_role = 'origin';

SELECT setval(pg_get_serial_sequence('"Negocios"', 'IdNegocio'), (SELECT MAX("IdNegocio") FROM "Negocios"));
SELECT setval(pg_get_serial_sequence('"Roles"', 'IdRol'), (SELECT MAX("IdRol") FROM "Roles"));
SELECT setval(pg_get_serial_sequence('"Usuarios"', 'IdUsuario'), (SELECT MAX("IdUsuario") FROM "Usuarios"));

COMMIT;
