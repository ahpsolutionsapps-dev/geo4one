-- Elimina el dashboard básico vacío y restaura el dashboard original.
DELETE FROM "RolModulos"
WHERE "IdModulo" = 50;

INSERT INTO "RolModulos" ("IdRol", "IdModulo")
SELECT 3, 15
WHERE NOT EXISTS (
    SELECT 1
    FROM "RolModulos" rm
    WHERE rm."IdRol" = 3
      AND rm."IdModulo" = 15
);

DELETE FROM "Modulos"
WHERE "IdModulo" = 50
   OR "Codigo" = 'dashboard_basic';
