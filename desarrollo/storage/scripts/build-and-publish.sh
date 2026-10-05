#!/usr/bin/env bash
set -euo pipefail

STORAGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLISH_ROOT="$(cd "$STORAGE_DIR/../.." && pwd)/publicar"
PUBLISH_DIR="$PUBLISH_ROOT/storage"
mkdir -p "$PUBLISH_ROOT"
STAGING_DIR="$(mktemp -d "$PUBLISH_ROOT/.storage-build.XXXXXX")"

cleanup() {
  rm -rf "$STAGING_DIR"
}
trap cleanup EXIT

cd "$STORAGE_DIR"
npm run prisma:generate
npm run build:prod

mkdir -p "$STAGING_DIR/prisma"
cp -R dist "$STAGING_DIR/"
cp package.json package-lock.json "$STAGING_DIR/"
cp prisma/schema.prisma "$STAGING_DIR/prisma/"
cp -R prisma/migrations "$STAGING_DIR/prisma/"

rm -rf "$PUBLISH_DIR"
mv "$STAGING_DIR" "$PUBLISH_DIR"

printf 'Storage construido y publicado en: %s\n' "$PUBLISH_DIR"