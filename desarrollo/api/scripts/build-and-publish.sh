#!/usr/bin/env bash
set -euo pipefail

API_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLISH_ROOT="$(cd "$API_DIR/../.." && pwd)/publicar"
PUBLISH_DIR="$PUBLISH_ROOT/api"
mkdir -p "$PUBLISH_ROOT"
STAGING_DIR="$(mktemp -d "$PUBLISH_ROOT/.api-build.XXXXXX")"

cleanup() {
  rm -rf "$STAGING_DIR"
}
trap cleanup EXIT

cd "$API_DIR"
npm run prisma:generate
npm run build:prod

mkdir -p "$STAGING_DIR/prisma"
cp -R dist "$STAGING_DIR/"
cp package.json package-lock.json prisma.config.ts "$STAGING_DIR/"
cp prisma/schema.prisma "$STAGING_DIR/prisma/"
cp -R prisma/migrations "$STAGING_DIR/prisma/"

rm -rf "$PUBLISH_DIR"
mv "$STAGING_DIR" "$PUBLISH_DIR"

printf 'API construida y publicada en: %s\n' "$PUBLISH_DIR"