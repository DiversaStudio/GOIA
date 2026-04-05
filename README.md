# GOIA - AI Governance SaaS Platform

## Vision

Global AI Oversight Initiative - A comprehensive governance platform for public and private sector organizations to ensure AI systems remain compliant, fair, secure and accountable as regulation worldwide evolves.

## Architecture

- **Backend**: Python FastAPI
- **Frontend**: React Next.js with shadcn/ui
- **Database**: PostgreSQL
- **Auth**: JWT + Email Verification

## Core Pillars

1. **Regulation & Compliance**: AI Systems Registry, Risk Classification, Compliance Templates, Dashboard
2. **Privacy & Data Governance**: Data flow declaration, DPIA, Privacy Dashboard
3. **Bias & Fairness**: Fairness Assessment, Model Cards, Bias Alerts
4. **Observability & Audit Trails**: Activity Logs, Evidence Vault, Health Summary

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use provided docker-compose)

### Quick Start

```bash
# Setup environment
cp .env.example .env

# Start services
docker-compose up -d

# Run migrations
make migrate

# Start backend
make start-backend

# Start frontend
make start-frontend
```

## Regulated Frameworks

- EU AI Act
- EU GDPR
- NIST AI RMF (USA)
- UK AI Regulation
- **Global South Framework** (African Union, Southeast Asia, Latin America)
- Configurable for any jurisdiction

## Project Structure

```
GOIA/
├── packages/
│   ├── api/                 # FastAPI backend
│   ├── db/                  # Shared DB layer
│   └── shared/             # Shared utilities
└── packages/
    └── frontend/           # Next.js frontend
```

## Contributing

This is an AI Governance platform - please review code for security and compliance best practices.

## License

Proprietory - See LICENSE file
