-- Módulo de menú: Resumen del día (dashboard admin)
INSERT INTO "Modulos" (
    "IdModulo", "Codigo", "NombreModulo", "Icono", "Ruta", "IdPadre", "OrderIndex"
) OVERRIDING SYSTEM VALUE VALUES
(49, 'dashboard_admin', 'Resumen del día', 'admin_dashboard', '/dashboards/admin', 2, 2)
ON CONFLICT ("IdModulo") DO UPDATE SET
    "Codigo" = EXCLUDED."Codigo",
    "NombreModulo" = EXCLUDED."NombreModulo",
    "Icono" = EXCLUDED."Icono",
    "Ruta" = EXCLUDED."Ruta",
    "IdPadre" = EXCLUDED."IdPadre",
    "OrderIndex" = EXCLUDED."OrderIndex";

-- Administrador del negocio (IdRol = 3)
INSERT INTO "RolModulos" ("IdRol", "IdModulo")
SELECT 3, 49
WHERE NOT EXISTS (
    SELECT 1
    FROM "RolModulos" rm
    WHERE rm."IdRol" = 3
      AND rm."IdModulo" = 49
);

SELECT setval(
    pg_get_serial_sequence('"Modulos"', 'IdModulo'),
    COALESCE((SELECT MAX("IdModulo") FROM "Modulos"), 1),
    true
);
