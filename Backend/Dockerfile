FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for asyncpg + pg_isready health check
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev postgresql-client && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

CMD ["/entrypoint.sh"]

CMD ["/entrypoint.sh"]
