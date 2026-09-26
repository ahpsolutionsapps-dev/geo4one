# Diagrama de Relaciones - Base de Datos Elementos

## Descripción General

Este documento muestra las relaciones entre todas las tablas del modelo de datos para gestión de Elementos, Proveedores y ubicaciones geográficas.

## Diagrama ER (Entity Relationship)

```mermaid
erDiagram
    PROVINCIAS ||--o{ MUNICIPIOS : "IdProvincia"
    MUNICIPIOS ||--o{ SECTORESBARRIOS : "IdMunicipio"
    
    PROVINCIAS ||--o{ PROVEEDORES : "IdProvincia"
    MUNICIPIOS ||--o{ PROVEEDORES : "IdMunicipio"
    SECTORESBARRIOS ||--o{ PROVEEDORES : "IdSectorBarrio"
    
    PROVEEDORES ||--o{ PROVEEDORESTELEFONOS : "IdProveedor"
    
    TIPOSELEMENTOS ||--o{ FORMATOS : "IdTipoElemento"
    
    PROVINCIAS ||--o{ ELEMENTOS : "IdProvincia"
    MUNICIPIOS ||--o{ ELEMENTOS : "IdMunicipio"
    SECTORESBARRIOS ||--o{ ELEMENTOS : "IdSectorBarrio"
    PROVEEDORES ||--o{ ELEMENTOS : "IdProveedor"
    TIPOSELEMENTOS ||--o{ ELEMENTOS : "IdTipoElemento"
    FORMATOS ||--o{ ELEMENTOS : "IdFormato"
    TAMANOS ||--o{ ELEMENTOS : "IdTamano"
    ORIENTACIONES ||--o{ ELEMENTOS : "IdOrientacion"
    
    AUDITORIA ||--o{ PROVINCIAS : "audita"
    AUDITORIA ||--o{ MUNICIPIOS : "audita"
    AUDITORIA ||--o{ SECTORESBARRIOS : "audita"
    AUDITORIA ||--o{ PROVEEDORES : "audita"
    AUDITORIA ||--o{ PROVEEDORESTELEFONOS : "audita"
    AUDITORIA ||--o{ ORIENTACIONES : "audita"
    AUDITORIA ||--o{ TIPOSELEMENTOS : "audita"
    AUDITORIA ||--o{ FORMATOS : "audita"
    AUDITORIA ||--o{ TAMANOS : "audita"
    AUDITORIA ||--o{ ELEMENTOS : "audita"
    
    PROVINCIAS {
        bigint IdProvincia PK
        string Provincia UK
        numeric Latitud
        numeric Longitud
        boolean Activo
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    MUNICIPIOS {
        bigint IdMunicipio PK
        bigint IdProvincia FK
        string Municipio
        numeric Latitud
        numeric Longitud
        boolean Activo
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    SECTORESBARRIOS {
        bigint IdSectorBarrio PK
        bigint IdMunicipio FK
        string SectorBarrio
        string Circunscripcion
        numeric Latitud
        numeric Longitud
        boolean Activo
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    PROVEEDORES {
        bigint IdProveedor PK
        string Proveedor
        string RNC UK
        string PersonaContacto
        string Cargo
        string Email
        string PaginaWeb
        string Direccion
        bigint IdProvincia FK
        bigint IdMunicipio FK
        bigint IdSectorBarrio FK
        boolean Activo
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    PROVEEDORESTELEFONOS {
        bigint IdProveedorTelefono PK
        bigint IdProveedor FK
        string Telefono
        string Tipo
        boolean Principal
        boolean Activo
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    ORIENTACIONES {
        bigint IdOrientacion PK
        string Orientacion UK
        boolean Activo
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    TIPOSELEMENTOS {
        bigint IdTipoElemento PK
        string TipoElemento UK
        boolean Activo
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    FORMATOS {
        bigint IdFormato PK
        bigint IdTipoElemento FK
        string Formato
        string IconoMapa
        boolean Activo
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    TAMANOS {
        bigint IdTamano PK
        string Tamano UK
        boolean Activo
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    ELEMENTOS {
        bigint IdElemento PK
        bigint IdProveedor FK
        string Licencia
        date FechaEmision
        date FechaVencimiento
        string IdSeguimiento
        bigint IdTipoElemento FK
        bigint IdFormato FK
        bigint IdTamano FK
        boolean Activo
        numeric CostoAlquiler
        string Direccion
        bigint IdOrientacion FK
        bigint IdProvincia FK
        bigint IdMunicipio FK
        bigint IdSectorBarrio FK
        string Circunscripcion
        numeric Latitud
        numeric Longitud
        boolean Anulado
        bigint AnuladoPor
        string ComentarioAnulado
        timestamptz FechaAnulacion
        timestamptz FechaCreacion
        timestamptz FechaActualizacion
        bigint CreadoPor
        bigint ActualizadoPor
    }
    
    AUDITORIA {
        bigint IdAuditoria PK
        string Tabla
        bigint IdRegistro
        string Accion
        bigint IdUsuario
        jsonb DatosAnteriores
        jsonb DatosNuevos
        inet DireccionIP
        text UserAgent
        timestamptz Fecha
    }
```

## Resumen de Relaciones

### Jerarquía Geográfica
- **Provincias** → **Municipios** (1:N)
- **Municipios** → **SectoresBarrios** (1:N)

### Proveedores y Ubicación
- **Provincias** → **Proveedores** (1:N)
- **Municipios** → **Proveedores** (1:N)
- **SectoresBarrios** → **Proveedores** (1:N)
- **Proveedores** → **ProveedoresTelefonos** (1:N)

### Clasificación de Elementos
- **TiposElementos** → **Formatos** (1:N)
- **TiposElementos** → **Elementos** (1:N)
- **Formatos** → **Elementos** (1:N)
- **Tamanos** → **Elementos** (1:N)
- **Orientaciones** → **Elementos** (1:N)

### Elementos y Ubicación
- **Provincias** → **Elementos** (1:N)
- **Municipios** → **Elementos** (1:N)
- **SectoresBarrios** → **Elementos** (1:N)
- **Proveedores** → **Elementos** (1:N)

### Auditoría
- **Auditoria** registra cambios en todas las tablas (Foreign Keys lógicas)

## Características Principales

### Auditoría Completa
Todas las tablas tienen triggers que registran:
- Fecha de creación y actualización
- Usuario que realizó la acción
- Auditoría detallada con datos anteriores y nuevos

### Anulación Lógica
La tabla **Elementos** soporta anulación lógica con:
- `Anulado` (boolean)
- `AnuladoPor` (usuario)
- `ComentarioAnulado` (motivo)
- `FechaAnulacion` (timestamp)

### Validaciones CHECK
- **Elementos**: `FechaVencimiento >= FechaEmision`
- **Elementos**: `CostoAlquiler >= 0`
- **Elementos**: Coherencia en campos de anulación
- **Auditoria**: Acción debe ser INSERT, UPDATE o DELETE

### Índices Optimizados
Se han creado índices para:
- Claves foráneas (relaciones)
- Búsquedas frecuentes (Proveedor, Licencia, Activo, Anulado)
- Auditoría (Tabla, IdRegistro, IdUsuario, Fecha)
- Ubicación geográfica (Provincia, Municipio, SectorBarrio)
