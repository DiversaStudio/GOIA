#!/bin/bash
# Quick start script for GOIA backend
set -e

echo "=== GOIA Backend ==="
echo "Starting FastAPI application..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found. Using default settings."
fi

# Start uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
