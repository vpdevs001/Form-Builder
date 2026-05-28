# Docker Deployment Guide

This guide explains how to deploy the Form Builder application using Docker on your VPS.

## Prerequisites

- Docker Engine 20.10+ ([Install Docker](https://docs.docker.com/engine/install/))
- Docker Compose 2.0+ ([Install Docker Compose](https://docs.docker.com/compose/install/))
- A VPS with at least 2GB RAM and 10GB storage
- Your environment variables configured

## Project Structure

```
Form-Builder/
├── apps/
│   ├── api/
│   │   └── Dockerfile          # API backend container
│   └── web/
│   │   └── Dockerfile          # Web frontend container
├── packages/                    # Shared packages
├── docker-compose.yml           # Orchestration configuration
└── .dockerignore                # Files to exclude from Docker builds
```

## Environment Setup

### 1. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=dev
DATABASE_URL=postgresql://postgres:your_secure_password_here@postgresdb:5432/dev

# API Configuration
NODE_ENV=production
PORT=8000
BASE_URL=http://your-vps-ip:8000

# Web Configuration
NEXT_PUBLIC_API_URL=http://your-vps-ip:8000
```

### 2. Replace with Your Domain/IP

If you have a domain, update:
- `BASE_URL`: Use your API domain (e.g., `https://api.yourdomain.com`)
- `NEXT_PUBLIC_API_URL`: Use your frontend domain (e.g., `https://yourdomain.com`)

## Deployment Steps

### 1. Clone and Navigate to Project

```bash
cd /path/to/Form-Builder
```

### 2. Build and Start Services

```bash
# Build images and start all services
docker-compose up -d

# Verify all services are running
docker-compose ps
```

### 3. Run Database Migrations

```bash
# Run migrations (if needed)
docker-compose exec api npm run db:migrate
```

### 4. Verify Deployment

```bash
# Check API health
curl http://your-vps-ip:8000/health

# Check Web frontend
curl http://your-vps-ip:3000

# View logs
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f postgresdb
```

## Service Architecture

### Services Overview

| Service | Port | Purpose |
|---------|------|---------|
| **postgresdb** | 5432 | PostgreSQL database |
| **api** | 8000 | tRPC API backend |
| **web** | 3000 | Next.js frontend |

### Network

All services communicate via `form-builder-network` bridge network:
- `api` → database via `postgresdb:5432`
- `web` → api via `api:8000`

### Health Checks

Each service includes health checks:
- **Database**: `pg_isready` every 10s
- **API**: HTTP endpoint check every 30s
- **Web**: HTTP GET every 30s

## Production Deployment (with Nginx Reverse Proxy)

### 1. Install Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

### 2. Create Nginx Configuration

Create `/etc/nginx/sites-available/form-builder`:

```nginx
upstream api_backend {
    server 127.0.0.1:8000;
}

upstream web_frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-vps-ip-or-domain;

    # Redirect HTTP to HTTPS (optional, for SSL)
    # return 301 https://$server_name$request_uri;

    # API routes
    location /api/ {
        proxy_pass http://api_backend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Web frontend
    location / {
        proxy_pass http://web_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Enable Nginx Configuration

```bash
sudo ln -s /etc/nginx/sites-available/form-builder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Common Docker Commands

```bash
# View all containers
docker-compose ps

# View logs for a specific service
docker-compose logs api          # API logs
docker-compose logs web          # Web logs
docker-compose logs postgresdb   # Database logs

# View real-time logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v

# Rebuild specific service
docker-compose build api
docker-compose up -d api

# Execute command in a container
docker-compose exec api npm run build

# View container shell
docker-compose exec api sh
```

## Troubleshooting

### Services not starting

```bash
# Check logs
docker-compose logs

# Verify ports are available
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :5432
```

### Database connection issues

```bash
# Test database connection
docker-compose exec postgresdb psql -U postgres -d dev -c "SELECT 1"

# View database logs
docker-compose logs postgresdb
```

### API not responding

```bash
# Check API container
docker-compose logs api

# Test API endpoint directly
curl -v http://localhost:8000/health
```

### Web frontend blank or errors

```bash
# Verify environment variable
docker-compose exec web cat .env.local

# Check Next.js build
docker-compose logs web
```

## Performance Optimization

### 1. Enable Resource Limits

Update `docker-compose.yml` service sections:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 2. Database Optimization

```bash
# Access PostgreSQL
docker-compose exec postgresdb psql -U postgres

# Create indexes (run in your migrations)
CREATE INDEX idx_forms_creator ON forms(creator_id);
CREATE INDEX idx_submissions_form ON submissions(form_id);
```

## Scaling & Updates

### Update Image

```bash
# Pull latest code
git pull origin main

# Rebuild and restart services
docker-compose up -d --build

# Restart without rebuilding
docker-compose restart
```

### Backup Database

```bash
# Backup PostgreSQL
docker-compose exec postgresdb pg_dump -U postgres dev > backup.sql

# Restore backup
cat backup.sql | docker-compose exec -T postgresdb psql -U postgres -d dev
```

## SSL/TLS Configuration (Let's Encrypt)

### 1. Install Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx
```

### 2. Obtain Certificate

```bash
sudo certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com
```

### 3. Update Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Support & Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL in Docker](https://hub.docker.com/_/postgres)
