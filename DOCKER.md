# Docker Deployment Guide

This guide explains how to deploy Retouchly using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### 1. Environment Setup

Copy the production environment file and fill in your values:

```bash
cp .env.production .env.production.local
```

Edit `.env.production.local` with your actual production values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# OpenAI API Key for AI Assistant
OPENAI_API_KEY=sk-your_openai_key

# Replicate API Token for AI Models
REPLICATE_API_TOKEN=r8_your_replicate_token

# Iyzico Payment Configuration (for production)
IYZICO_API_KEY=your_iyzico_key
IYZICO_API_SECRET=your_iyzico_secret
IYZICO_BASE_URL=https://api.iyzipay.com
```

### 2. Build and Run with Docker Compose

```bash
# Build and start the application
npm run docker:compose:up

# View logs
npm run docker:compose:logs

# Stop the application
npm run docker:compose:down
```

### 3. Manual Docker Build

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

## Docker Commands

### Building

```bash
# Build the image
docker build -t retouchly .

# Build with specific tag
docker build -t retouchly:v1.0.0 .
```

### Running

```bash
# Run with environment file
docker run -p 3000:3000 --env-file .env.production.local retouchly

# Run with individual environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e OPENAI_API_KEY=your_openai_key \
  retouchly
```

### Docker Compose

```bash
# Start services in background
docker-compose up -d

# Start services with logs
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f retouchly

# Rebuild and restart
docker-compose up --build -d
```

## Health Check

The application includes a health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

## Production Deployment

### 1. Environment Variables

Ensure all required environment variables are set:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `OPENAI_API_KEY`: Your OpenAI API key for AI assistant
- `REPLICATE_API_TOKEN`: Your Replicate API token for AI models
- `IYZICO_API_KEY`: Your Iyzico API key (for payments)
- `IYZICO_API_SECRET`: Your Iyzico API secret
- `IYZICO_BASE_URL`: Iyzico API base URL

### 2. Security Considerations

- Use secrets management for sensitive environment variables
- Enable HTTPS in production
- Configure proper firewall rules
- Use a reverse proxy (nginx, Traefik) for SSL termination
- Monitor application logs and metrics

### 3. Scaling

For production scaling, consider:

- Using Docker Swarm or Kubernetes
- Adding a load balancer
- Implementing Redis for session storage
- Using a CDN for static assets
- Database connection pooling

## Troubleshooting

### Common Issues

1. **Build fails with dependency errors**

   ```bash
   # Clear Docker cache and rebuild
   docker system prune -a
   docker build --no-cache -t retouchly .
   ```

2. **Application won't start**

   ```bash
   # Check logs
   docker logs <container_id>

   # Check environment variables
   docker exec -it <container_id> env
   ```

3. **Health check fails**

   ```bash
   # Test health endpoint
   curl -f http://localhost:3000/api/health

   # Check application logs
   docker-compose logs retouchly
   ```

### Performance Optimization

1. **Multi-stage builds**: Already implemented in Dockerfile
2. **Layer caching**: Dependencies are cached separately
3. **Standalone output**: Next.js standalone mode for smaller images
4. **Alpine Linux**: Using alpine base image for smaller size

## Monitoring

### Docker Stats

```bash
# View resource usage
docker stats

# View specific container stats
docker stats retouchly
```

### Application Metrics

The application exposes metrics at:

- Health: `/api/health`
- Logs: Available through Docker logs

## Backup and Recovery

### Database Backup (Supabase)

Supabase handles database backups automatically, but you can also:

1. Export data through Supabase dashboard
2. Use Supabase CLI for automated backups
3. Implement custom backup scripts

### File Storage Backup

If using local file storage, ensure to:

1. Mount volumes for persistent data
2. Implement regular backup procedures
3. Test recovery procedures

## Updates and Maintenance

### Updating the Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up --build -d

# Check health
curl http://localhost:3000/api/health
```

### Security Updates

```bash
# Update base image
docker pull node:18-alpine

# Rebuild with latest dependencies
docker build --no-cache -t retouchly .
```
