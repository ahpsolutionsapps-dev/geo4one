# Diagrama de Relaciones - Base de Datos Elementos (Simplificado)

```mermaid
erDiagram
    PROVINCIAS ||--o{ MUNICIPIOS : ""
    MUNICIPIOS ||--o{ SECTORESBARRIOS : ""
    
    PROVINCIAS ||--o{ PROVEEDORES : ""
    MUNICIPIOS ||--o{ PROVEEDORES : ""
    SECTORESBARRIOS ||--o{ PROVEEDORES : ""
    
    PROVEEDORES ||--o{ PROVEEDORESTELEFONOS : ""
    PROVEEDORES ||--o{ ELEMENTOS : ""
    
    TIPOSELEMENTOS ||--o{ FORMATOS : ""
    FORMATOS ||--o{ ELEMENTOS : ""
    TIPOSELEMENTOS ||--o{ ELEMENTOS : ""
    TAMANOS ||--o{ ELEMENTOS : ""
    ORIENTACIONES ||--o{ ELEMENTOS : ""
    
    PROVINCIAS ||--o{ ELEMENTOS : ""
    MUNICIPIOS ||--o{ ELEMENTOS : ""
    SECTORESBARRIOS ||--o{ ELEMENTOS : ""
    
    PROVINCIAS ||--o{ AUDITORIA : ""
    MUNICIPIOS ||--o{ AUDITORIA : ""
    SECTORESBARRIOS ||--o{ AUDITORIA : ""
    PROVEEDORES ||--o{ AUDITORIA : ""
    PROVEEDORESTELEFONOS ||--o{ AUDITORIA : ""
    ORIENTACIONES ||--o{ AUDITORIA : ""
    TIPOSELEMENTOS ||--o{ AUDITORIA : ""
    FORMATOS ||--o{ AUDITORIA : ""
    TAMANOS ||--o{ AUDITORIA : ""
    ELEMENTOS ||--o{ AUDITORIA : ""
    
    PROVINCIAS {}
    MUNICIPIOS {}
    SECTORESBARRIOS {}
    PROVEEDORES {}
    PROVEEDORESTELEFONOS {}
    ORIENTACIONES {}
    TIPOSELEMENTOS {}
    FORMATOS {}
    TAMANOS {}
    ELEMENTOS {}
    AUDITORIA {}
```

## Tablas del Sistema

| Tabla | Descripción |
|-------|-------------|
| Provincias | Ubicaciones a nivel provincia |
| Municipios | Ubicaciones a nivel municipio |
| SectoresBarrios | Sectores o barrios dentro de municipios |
| Proveedores | Datos de proveedores/suplidores |
| ProveedoresTelefonos | Teléfonos de contacto de proveedores |
| Orientaciones | Orientaciones geográficas (N, S, E, O) |
| TiposElementos | Clasificación de tipos de elementos |
| Formatos | Formatos dentro de tipos de elementos |
| Tamanos | Tamaños/dimensiones de elementos |
| Elementos | Elementos publicitarios principales |
| Auditoria | Registro de cambios en todas las tablas |
