# GlassMorphismTodo — PostgreSQL edition

A complete, single to-do web application: React + Vite frontend, Nginx reverse proxy, Express API, and PostgreSQL 17.

## Requirements

- Docker Engine with Docker Compose v2
- A free host port (default 8101)

## Start

```bash
cp .env.example .env
# Edit .env: replace POSTGRES_PASSWORD with a strong unique password
chmod 600 .env
docker compose config
docker compose up -d --build
docker compose ps
curl -f http://localhost:8101/api/health
```

Open `http://YOUR_SERVER_IP:8101`. For external access ensure the host/cloud firewall permits the selected port.

## Layout

- `frontend/`: React + Vite glassmorphism UI, served by Nginx
- `backend/`: Express REST API backed by PostgreSQL
- `compose.yaml`: web, api, and db services on one private Docker network
- `.env.example`: deploy-time settings

Only the Nginx frontend port is published. Nginx proxies `/api/*` requests to the private API, which connects to PostgreSQL over Docker networking. PostgreSQL stores data in a persistent named volume.

## Commands

```bash
docker compose logs -f --tail=100
docker compose restart
docker compose down          # retains PostgreSQL data
```

**Do not use `docker compose down -v` unless you intend to delete the database.**

## Existing SQLite data

This full source starts with a new PostgreSQL database. Existing SQLite tasks are **not automatically imported**; back up your SQLite data first if you need it.

## Public production security

This demo has no authentication or TLS. Do not expose sensitive tasks to the public internet without authentication and HTTPS termination at a trusted reverse proxy. Store `.env` securely and back up PostgreSQL. Changing credentials in `.env` after the first database initialization does not automatically update existing PostgreSQL users.

## Troubleshooting

```bash
docker compose logs --tail=150 db api web
docker compose ps
curl -v http://127.0.0.1:8101/api/health
```
