-- ============================================================
-- MÓDULO DE NAVEGACIÓN DEL FRONTEND
-- Inserta la estructura de menú definida en planificacion/frontend/navegacion/navegacion.md
-- y la deja disponible para el menú dinámico de roles desde la tabla Modulos.
-- ============================================================

INSERT INTO "Modulos" (
    "IdModulo",
    "Codigo",
    "NombreModulo",
    "Icono",
    "Ruta",
    "IdPadre",
    "OrderIndex"
) OVERRIDING SYSTEM VALUE VALUES

    (1001, 'principal', 'Principal', 'dashboard', '/dashboards/home', NULL, 1),
    (1010, 'principal_dashboard', 'Dashboard', 'dashboard', '/dashboards/home', 1001, 1),
    (1011, 'principal_notificaciones', 'Notificaciones', 'reportes', '/dashboards/notificaciones', 1001, 2),
    (1012, 'principal_reportes', 'Reportes', 'reportes', '/dashboards/reportes', 1001, 3),

    (1002, 'elementos', 'Elementos', 'elementos', '/dashboards/elementos', NULL, 2),
    (1020, 'elementos_suplidores', 'Suplidores', 'proveedores', '/dashboards/proveedores', 1002, 1),
    (1021, 'elementos_tipos_elementos', 'Tipos de Elementos', 'tipos', '/dashboards/catalogos/tipos', 1002, 2),
    (1022, 'elementos_tipos_formatos', 'Tipos de Formatos', 'formatos', '/dashboards/catalogos/formatos', 1002, 3),
    (1023, 'elementos_orientaciones', 'Orientaciones', 'orientaciones', '/dashboards/catalogos/orientaciones', 1002, 4),
    (1024, 'elementos_dimensiones', 'Dimensiones', 'tamanos', '/dashboards/catalogos/tamanos', 1002, 5),
    (1025, 'elementos_elementos', 'Elementos', 'elementos', '/dashboards/elementos', 1002, 6),

    (1003, 'ubicaciones', 'Ubicaciones', 'ubicaciones', '/dashboards/catalogos/ubicaciones', NULL, 3),
    (1030, 'ubicaciones_provincias', 'Provincias', 'ubicaciones', '/dashboards/catalogos/ubicaciones', 1003, 1),
    (1031, 'ubicaciones_municipios', 'Municipios', 'ubicaciones', '/dashboards/catalogos/ubicaciones', 1003, 2),
    (1032, 'ubicaciones_sectores', 'Sectores', 'ubicaciones', '/dashboards/catalogos/ubicaciones', 1003, 3),

    (1004, 'anunciantes', 'Anunciantes', 'anunciantes', '/dashboards/anunciantes', NULL, 4),
    (1040, 'anunciantes_sector_industrial', 'Sector Industrial', 'anunciantes', '/dashboards/anunciantes', 1004, 1),
    (1041, 'anunciantes_sub_sector_industrial', 'Sub Sector Industrial', 'anunciantes', '/dashboards/anunciantes', 1004, 2),
    (1042, 'anunciantes_categoria', 'Categoría', 'anunciantes', '/dashboards/anunciantes', 1004, 3),
    (1043, 'anunciantes_anunciante', 'Anunciante', 'anunciantes', '/dashboards/anunciantes', 1004, 4),
    (1044, 'anunciantes_marca_producto', 'Marca / Producto', 'anunciantes', '/dashboards/anunciantes', 1004, 5),
    (1045, 'anunciantes_periodos_colocacion', 'Períodos de Colocación', 'periodos', '/dashboards/periodos', 1004, 6),
    (1046, 'anunciantes_combo_anunciantes', 'Combo de Anunciantes', 'anunciantes', '/dashboards/anunciantes', 1004, 7),
    (1047, 'anunciantes_version_campana', 'Versión / Campaña', 'campanas', '/dashboards/campanas', 1004, 8),
    (1048, 'anunciantes_marcas_agua', 'Marcas de Agua', 'anunciantes', '/dashboards/anunciantes', 1004, 9),

    (1005, 'colocaciones', 'Colocaciones', 'periodos', '/dashboards/colocaciones', NULL, 5),
    (1050, 'colocaciones_colocaciones', 'Colocaciones', 'periodos', '/dashboards/colocaciones', 1005, 1),
    (1051, 'colocaciones_seguimientos', 'Seguimientos', 'reportes', '/dashboards/seguimientos', 1005, 2),
    (1052, 'colocaciones_incidencias', 'Incidencias', 'auditoria', '/dashboards/incidencias', 1005, 3),

    (1006, 'administracion', 'Administración', 'usuarios', '/dashboards/administracion', NULL, 6),
    (1060, 'administracion_usuarios', 'Usuarios', 'usuarios', '/dashboards/administracion/usuarios', 1006, 1),
    (1061, 'administracion_roles', 'Roles', 'usuarios', '/dashboards/administracion/roles', 1006, 2),
    (1062, 'administracion_configuracion', 'Configuración', 'configuracion', '/dashboards/administracion/configuracion', 1006, 3)
ON CONFLICT ("IdModulo") DO UPDATE SET
    "Codigo" = EXCLUDED."Codigo",
    "NombreModulo" = EXCLUDED."NombreModulo",
    "Icono" = EXCLUDED."Icono",
    "Ruta" = EXCLUDED."Ruta",
    "IdPadre" = EXCLUDED."IdPadre",
    "OrderIndex" = EXCLUDED."OrderIndex";

-- Asignación por defecto al rol maestro para que la navegación aparezca para Super Administrador.
INSERT INTO "RolModulos" ("IdRol", "IdModulo")
SELECT 1, m."IdModulo"
FROM "Modulos" m
WHERE m."IdModulo" BETWEEN 1001 AND 1062
AND NOT EXISTS (
    SELECT 1
    FROM "RolModulos" rm
    WHERE rm."IdRol" = 1
      AND rm."IdModulo" = m."IdModulo"
);

SELECT setval(
    pg_get_serial_sequence('"Modulos"', 'IdModulo'),
    COALESCE((SELECT MAX("IdModulo") FROM "Modulos"), 1),
    true
);
