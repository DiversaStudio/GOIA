# GOIA - Local Development Setup (No Docker Required)

Since Docker isn't available, here's how to run GOIA locally:

## Backend Setup

```bash
cd GOIA/packages/api

# Install Python dependencies
pip install -r requirements.txt

# Create virtual environment (optional but recommended)
python3 -m venv .venv
source .venv/bin/activate

# Create .env file
cp ../.env.example .env

# Run migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup

```bash
cd GOIA/packages/frontend

# Install Node dependencies
npm install

# Start frontend dev server
npm run dev
```

## Database Setup (Local PostgreSQL)

Option 1: Use your local PostgreSQL
Option 2: Install Docker Desktop and use docker-compose
Option 3: Create local DB with sqlite (for development)

## Alternative: Start Both Services

```bash
# In one terminal:
cd GOIA/packages/api && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# In another terminal:
cd GOIA/packages/frontend && npm run dev
```

## Access Points

- Frontend: http://localhost:3000
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- DB: localhost:5432 (if using PostgreSQL)

## Next Steps

1. Set up your database (PostgreSQL or SQLite for local)
2. Copy .env.example to .env and fill in details
3. Run database migrations
4. Start backend and frontend servers
