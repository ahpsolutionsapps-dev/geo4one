# Upload Service

Microservicio independiente de gestión de archivos con autenticación por API Key. Permite subir, descargar, versionar, categorizar y administrar archivos desde cualquier cliente (Flutter, React, .NET, Go, PHP, etc.).

## Requisitos

- Node.js 20+
- npm 10+

## Instalación rápida

### Windows

```powershell
cd servicios
.\scripts\install.ps1
```

### Linux / macOS

```bash
cd servicios
chmod +x scripts/*.sh
./scripts/install.sh
```

## Configuración

El servicio carga variables en este orden (las últimas sobreescriben):

1. `.env`
2. `.env.local` (opcional, no versionado)
3. `.env.development`, `.env.staging` o `.env.production` según `NODE_ENV`
4. `.env.development.local`, `.env.staging.local` o `.env.production.local` (opcional)

Para personalizar tu máquina sin tocar los archivos versionados:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servicio (default: 4000) |
| `DATABASE_URL` | URL de PostgreSQL (base `storagedb`) |
| `STORAGE_PATH` | Carpeta de almacenamiento físico |
| `MAX_FILE_SIZE` | Tamaño máximo en bytes |
| `ALLOWED_EXTENSIONS` | Extensiones permitidas (CSV) |
| `ALLOWED_MIME_TYPES` | MIME types permitidos (CSV) |
| `API_KEY_HEADER` | Header de autenticación (default: `X-API-KEY`) |
| `PUBLIC_URL` | URL pública del servicio |
| `ADMIN_TOKEN` | Token para endpoints de administración |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `CORS_ORIGIN` | Orígenes permitidos (`*` en desarrollo) |
| `LOG_LEVEL` | Nivel de log (`debug`, `info`, `warn`, `error`) |

### Entornos

| Entorno | Comando | Archivo base |
|---------|---------|--------------|
| Desarrollo | `npm run dev` | `.env.development` |
| Staging | `npm run build:prod && npm run start:staging` | `.env.staging` |
| Producción | `npm run build:prod && npm run start:prod` | `.env.production` |

En staging y producción, `ADMIN_TOKEN` y `JWT_SECRET` deben configurarse con valores seguros (no los placeholders del archivo).
En staging y producción también debe configurarse `DATABASE_URL` en el entorno de despliegue. Para desarrollo local, coloque la URL PostgreSQL en `.env.development.local`.

## Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm run build:prod
npm run start:prod
```

## Autenticación

Todas las rutas `/api/files/*` requieren el header:

```
X-API-KEY: tu-api-key
```

Los endpoints de administración requieren:

```
X-Admin-Token: tu-admin-token
```

Tras el seed inicial, la API Key por defecto se imprime en consola.

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/docs` | Swagger UI |
| POST | `/api/files/upload` | Subir archivo |
| GET | `/api/files` | Listado paginado |
| GET | `/api/files/:id` | Metadata |
| GET | `/api/files/download/:id` | Descargar |
| DELETE | `/api/files/:id` | Soft delete |
| POST | `/api/files/:id/restore` | Restaurar |
| POST | `/api/files/:id/categories` | Asignar categorías |
| POST | `/api/files/:id/tags` | Asignar etiquetas |
| POST | `/api/files/:id/version` | Nueva versión |
| GET | `/api/files/:id/versions` | Listar versiones |
| POST | `/api/files/:id/signed-url` | URL temporal firmada |
| GET | `/api/files/signed/:token` | Descarga por URL firmada |
| GET | `/api/files/metrics` | Métricas |
| POST | `/api/admin/apikeys` | Crear API Key |
| GET | `/api/admin/apikeys` | Listar API Keys |
| PUT | `/api/admin/apikeys/:id` | Activar/desactivar |
| DELETE | `/api/admin/apikeys/:id` | Eliminar API Key |

## Arquitectura

```
src/
├── domain/          # Entidades, repositorios, servicios de dominio
├── application/     # Casos de uso, DTOs, validadores
├── infrastructure/  # Prisma, almacenamiento, logger
├── presentation/    # Controllers, routes, middlewares, Swagger
├── shared/          # Errores, helpers, tipos
└── config/          # Env, contenedor DI
```

## Almacenamiento

Los archivos se guardan en `storage/YYYY/MM/DD/{uuid}.{ext}` con hash SHA256 en base de datos.
La base SQLite anterior no se migra automáticamente; el servicio conectado usa PostgreSQL.

## Documentación adicional

- Colección Postman: `postman/upload-service.postman_collection.json`
- Ejemplos de integración: `docs/examples/`

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor en modo desarrollo |
| `npm run build:prod` | Compilar TypeScript |
| `npm run start:prod` | Ejecutar producción |
| `npm run prisma:migrate` | Crear/aplicar migraciones (desarrollo) |
| `npm run prisma:deploy` | Aplicar migraciones (producción) |
| `npm run db:seed` | Crear API Key inicial |

## Preparado para cloud storage

La capa `IStorageService` permite sustituir `LocalStorageService` por adaptadores S3, MinIO, Azure Blob o GCS sin cambiar la lógica de negocio.
