
## Modulo: 
Provincias

## Entidad:
Provincias

## Entidades relacionadas: 
ninguna

## Características:
- Crear 
- Editar
- Anular
- Consultar
- Buscar
- Activar/desactivar
- Importar archivo excel
- No duplicar provincias

## Reglas aplicadas:
- Mantener la separación por capas: dominio, aplicación, infraestructura y presentación.
- La búsqueda debe hacerse con filtro global en la tabla, sin romper el patrón del resto de catálogos.
- Las provincias deben validarse por nombre único y evitar duplicados tanto en la UI como en la base de datos.
- El estado activo/inactivo debe registrarse en la entidad y respetar la lógica de anulación.
- Las importaciones Excel deben validar nombres, ignorar filas vacías y omitir duplicados existentes.
