# app_prototipo_api

API backend en Node.js + TypeScript con arquitectura limpia organizada por features.

## Estructura

```
src/
├── core/                       # Núcleo compartido (errores, utilidades, middlewares base)
│   ├── errors/
│   ├── http/
│   └── config/
├── features/                   # Features de negocio
│   └── auth/
│       ├── domain/             # Entidades, value objects, contratos (repositorios)
│       ├── application/        # Casos de uso (use cases) y DTOs
│       ├── infrastructure/     # Implementaciones (repositorios, servicios externos)
│       └── presentation/       # Controladores, rutas, validadores HTTP
├── app.ts                      # Configuración de la app Express
└── server.ts                   # Punto de entrada (arranque del servidor)
```

## Capas (Clean Architecture)

- **Domain**: lógica pura, sin dependencias de frameworks.
- **Application**: orquestación de casos de uso usando contratos del dominio.
- **Infrastructure**: detalles técnicos (DB, servicios externos, JWT, hashing).
- **Presentation**: adaptadores HTTP (Express), validación de entrada.

La dirección de las dependencias siempre apunta hacia adentro: `presentation → application → domain`, y `infrastructure → domain` (implementa contratos).

## Comandos

```bash
npm install
cp .env.example .env.local   # opcional: overrides locales
npm run dev                  # desarrollo con recarga
npm run build:prod           # compila a dist/
npm run start:prod           # producción
npm run start:staging        # staging
```

## Entornos

| Entorno | Dev | Start compilado | Archivo base |
|---------|-----|-----------------|--------------|
| Desarrollo | `npm run dev` | `npm run start:dev` | `.env.development` |
| Staging | — | `npm run start:staging` | `.env.staging` |
| Producción | — | `npm run start:prod` | `.env.production` |

Variables compartidas con otros servicios:

- `UPLOAD_SERVICE_API_KEY` debe coincidir con la API key del upload service en cada entorno.
- `UPLOAD_SERVICE_URL` en staging: `https://ahpsolutions-apps.com/prototipo/upload`
- `UPLOAD_SERVICE_URL` en producción: `https://upload.electronica.ahp-solutions.com`

Migraciones por entorno:

```bash
npm run db:setup:dev          # crea AppGestionNegocios_dev + esquema + seed dev
npm run db:setup:dev:recreate # borra y recrea AppGestionNegocios_dev desde cero
npm run prisma:deploy:staging
npm run prisma:deploy
```

Base de datos por entorno:

| Entorno | Base PostgreSQL local |
|---------|------------------------|
| Desarrollo | `AppGestionNegocios_dev` |
| Producción (`.env.production`) | `AppGestionNegocios` (copia local / prod) |

Credenciales seed de desarrollo (tras `npm run db:setup:dev`):

- Email: `administrador@example.com`
- Clave: `123456`

## Feature: auth

Endpoints expuestos bajo `/api/auth`:

- `POST /api/auth/register` — registra un nuevo usuario.
- `POST /api/auth/login` — autentica y devuelve un JWT.
- `GET  /api/auth/me` — devuelve el usuario autenticado (requiere `Authorization: Bearer <token>`).

> El repositorio actual usa Postgres a través de Prisma. Sustituir la persistencia por otro motor sin tocar las capas de dominio/aplicación.




npm run dev          # desarrollo con recarga
npm run build:prod   # compilar
npm run start:prod   # ejecutar en producción