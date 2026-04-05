#!/bin/bash
# Quick start script for GOIA frontend
set -e

echo "=== GOIA Frontend ==="
echo "Starting Next.js development server.."

# Check npm dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

npm run dev
