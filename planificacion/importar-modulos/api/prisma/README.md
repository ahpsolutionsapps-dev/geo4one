# Prisma — export auth / roles / usuarios

## Esquema reducido (recomendado en proyecto nuevo)

| Archivo | Uso |
|---------|-----|
| `schema.prisma` | 8 modelos: `Modulo`, `Negocio`, `Rol`, `Usuario`, `RolModulo`, `QrLoginSession`, `Sucursales`, `UsuarioSucursal` |
| `migrations-reducido/` | Una migración inicial (`20250917120000_init_auth_identity`) |
| `prisma.config.ts` | Config por defecto (esquema + migraciones reducidas) |
| `prisma.config.reducido.ts` | Alias de la config reducida |
| `prisma.config.completo.ts` | Esquema y migraciones del monolito |
| `seed-identidad.sql` | Seed opcional de negocio + rol + admin |

### Comandos (desde la raíz de la API del proyecto destino)

```bash
# Copiar prisma/ y prisma.config.reducido.ts, luego:
npx prisma migrate deploy
npx prisma generate
```

En desarrollo:

```bash
npx prisma migrate dev
```

Opcional: aplicar seed (ajusta el hash bcrypt antes):

```bash
psql "$DATABASE_URL" -f prisma/seed-identidad.sql
```

## Esquema completo del monolito (referencia)

| Archivo | Uso |
|---------|-----|
| `schema.completo.prisma` | Esquema original con todas las tablas |
| `migrations/` | 33 migraciones históricas del monolito |
| `migrations-completo/` | Copia de respaldo de esas migraciones |

Usa el esquema completo solo si vas a montar la misma base de datos grande o necesitas el historial exacto del producto principal.
