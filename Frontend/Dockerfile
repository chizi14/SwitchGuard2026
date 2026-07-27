# ── Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# ── Serve stage ──────────────────────────────────────────────
FROM nginx:alpine

# Copy built frontend from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config to proxy API requests
RUN echo 'server { \
    listen 5173; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { try_files $uri /index.html; } \
    location /api/notifications/stream { \
        proxy_pass http://backend:8000; \
        proxy_http_version 1.1; \
        proxy_set_header Connection ""; \
        proxy_set_header Host $host; \
        proxy_buffering off; \
        proxy_cache off; \
        chunked_transfer_encoding off; \
    } \
    location /api/ { proxy_pass http://backend:8000; } \
    location /health { proxy_pass http://backend:8000; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
