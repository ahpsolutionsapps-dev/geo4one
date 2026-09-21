-- Dashboard básico para roles distintos de idRol 1 y 2
INSERT INTO "Modulos" (
    "IdModulo", "Codigo", "NombreModulo", "Icono", "Ruta", "IdPadre", "OrderIndex"
) OVERRIDING SYSTEM VALUE VALUES
(50, 'dashboard_basic', 'Dashboard', 'home', '/dashboards/basic', 2, 1)
ON CONFLICT ("IdModulo") DO UPDATE SET
    "Codigo" = EXCLUDED."Codigo",
    "NombreModulo" = EXCLUDED."NombreModulo",
    "Icono" = EXCLUDED."Icono",
    "Ruta" = EXCLUDED."Ruta",
    "IdPadre" = EXCLUDED."IdPadre",
    "OrderIndex" = EXCLUDED."OrderIndex";

-- Vendedor (IdRol = 2): acceso a ambos dashboards
INSERT INTO "RolModulos" ("IdRol", "IdModulo")
SELECT v."IdRol", v."IdModulo"
FROM (
    VALUES (2, 2), (2, 15), (2, 49)
) AS v("IdRol", "IdModulo")
WHERE NOT EXISTS (
    SELECT 1
    FROM "RolModulos" rm
    WHERE rm."IdRol" = v."IdRol"
      AND rm."IdModulo" = v."IdModulo"
);

-- Administrador (IdRol = 3): dashboard básico en lugar del completo
DELETE FROM "RolModulos"
WHERE "IdRol" = 3
  AND "IdModulo" IN (15, 49);

INSERT INTO "RolModulos" ("IdRol", "IdModulo")
SELECT 3, 50
WHERE NOT EXISTS (
    SELECT 1
    FROM "RolModulos" rm
    WHERE rm."IdRol" = 3
      AND rm."IdModulo" = 50
);

SELECT setval(
    pg_get_serial_sequence('"Modulos"', 'IdModulo'),
    COALESCE((SELECT MAX("IdModulo") FROM "Modulos"), 1),
    true
);
