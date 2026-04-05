.PHONY: help start-backend start-frontend migrate build test lint format

help:
	@echo "Available commands:"
	@echo "  make help         - Show this help message"
	@echo "  make start        - Start both backend and frontend services"
	@echo "  make start-backend - Start only the backend"
	@echo "  make start-frontend - Start only the frontend"
	@echo "  make migrate      - Run database migrations"
	@echo "  make test         - Run tests"
	@echo "  make lint         - Run linting check"
	@echo "  make format       - Format code"
	@echo "  make clean        - Clean build artifacts"

start:
	docker-compose up -d

start-backend:
	docker-compose up -d backend db

start-frontend:
	docker-compose up -d frontend backend db

migrate:
	docker-compose exec -T backend alembic upgrade head

test:
	docker-compose exec -T backend pytest -v

lint:
	docker-compose exec -T backend ruff check app

format:
	docker-compose exec -T backend black app

clean:
	rm -rf .venv node_modules .next
