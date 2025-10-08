# Makefile for Retouchly Docker operations

# Variables
IMAGE_NAME = retouchly
CONTAINER_NAME = retouchly-app
PORT = 3000

# Default target
.DEFAULT_GOAL := help

# Help target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
dev: ## Start development server
	npm run dev

# Build
build: ## Build the Docker image
	docker build -t $(IMAGE_NAME) .

build-no-cache: ## Build the Docker image without cache
	docker build --no-cache -t $(IMAGE_NAME) .

# Run
run: ## Run the Docker container
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):$(PORT) --env-file .env.production.local $(IMAGE_NAME)

run-interactive: ## Run the Docker container interactively
	docker run -it --rm -p $(PORT):$(PORT) --env-file .env.production.local $(IMAGE_NAME)

# Docker Compose
up: ## Start services with docker-compose
	docker-compose up -d

up-build: ## Build and start services with docker-compose
	docker-compose up --build -d

down: ## Stop services with docker-compose
	docker-compose down

logs: ## View logs from docker-compose
	docker-compose logs -f

# Container management
stop: ## Stop the running container
	docker stop $(CONTAINER_NAME) || true

remove: ## Remove the container
	docker rm $(CONTAINER_NAME) || true

restart: stop remove run ## Restart the container

# Image management
clean: ## Remove the Docker image
	docker rmi $(IMAGE_NAME) || true

clean-all: ## Remove all unused Docker resources
	docker system prune -a -f

# Health check
health: ## Check application health
	curl -f http://localhost:$(PORT)/api/health || echo "Health check failed"

# Logs
container-logs: ## View container logs
	docker logs -f $(CONTAINER_NAME)

# Shell access
shell: ## Access container shell
	docker exec -it $(CONTAINER_NAME) /bin/sh

# Production deployment
deploy: build up health ## Build, deploy and check health

# Development workflow
dev-build: build run health ## Build, run and check health for development

# Cleanup workflow
cleanup: down remove clean ## Stop, remove container and clean image

# Full reset
reset: cleanup clean-all ## Complete cleanup and reset

.PHONY: help dev build build-no-cache run run-interactive up up-build down logs stop remove restart clean clean-all health container-logs shell deploy dev-build cleanup reset