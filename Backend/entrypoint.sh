#!/bin/bash
set -e

echo "==> Running Alembic migrations..."
cd /app
alembic upgrade head

echo "==> Seeding database..."
python -m app.seed

echo "==> Starting SwitchGuard API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
