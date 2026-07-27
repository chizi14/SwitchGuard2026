#!/bin/bash
set -e

echo "==> Waiting for Postgres..."
until pg_isready -h db -U ${POSTGRES_USER:-switchguard} -d ${POSTGRES_DB:-switchguard} 2>/dev/null; do
  echo "   Waiting... (pg_isready failed, retrying in 3s)"
  sleep 3
done
echo "   Postgres is ready."

echo "==> Running Alembic migrations..."
cd /app
alembic upgrade head

echo "==> Seeding database (idempotent — skips if already seeded)..."
python -m app.seed || echo "   Seed skipped (DB may already be populated)."

echo "==> Starting SwitchGuard API on port 8000..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
