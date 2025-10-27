# ====================================================
# 🐳 DOCKER COMPOSE COMMANDS
# ====================================================

# Pull latest changes, build containers, and clean up unused images
.PHONY: deploy
deploy:
	@echo "📦 Pulling latest resources from git..."
	@git pull

	@echo "🔧 Building and starting container..."
	@docker compose -f docker-compose.yml -p marketplace-api up -d --build --force-recreate

	@echo "🧹 Cleaning up unused Docker images..."
	@docker image prune -f

# Restart containers
.PHONY: restart
restart:
	@echo "🚀 Restarting container..."
	@docker compose -f docker-compose.yml -p marketplace-api up -d

# Clean up container and image
.PHONY: clean
clean:
	@echo "🛑 Stopping and removing containers, volumes, and image..."
	@docker compose -f docker-compose.yml -p marketplace-api down -v --rmi all