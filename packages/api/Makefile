.PHONY: help run migrate test lint format

help:
	@echo "Available commands:"
	@echo "  make run        - Run the backend server"
	@echo "  make migrate    - Run database migrations"
	@echo "  make test       - Run tests"
	@echo "  make lint       - Run linting check"
	@echo "  make format     - Format code"

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

migrate:
	alembic upgrade head

test:
	pytest -v -s

lint:
	ruff check app

format:
	black app
