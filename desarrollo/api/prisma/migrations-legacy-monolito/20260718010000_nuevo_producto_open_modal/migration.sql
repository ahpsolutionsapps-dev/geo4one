-- Abrir modal de nuevo producto al entrar desde Acciones Rápidas
UPDATE "Modulos"
SET "Ruta" = '/productos?nuevo=1'
WHERE "Codigo" = 'nuevo_producto' OR "IdModulo" = 11;
