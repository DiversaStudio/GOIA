from dotenv import load_dotenv
from app import settings

def setup_development():
    """Setup development environment"""
    load_dotenv()
    print("GOIA Development Environment Initialized")
    print("=" * 50)
    print("\nNext steps:")
    print("1. Install dependencies: pip install -r packages/api/requirements.txt")
    print("2. Create .env from packages/api/.env.example")
    print("3. For SQLite: DATABASE_URL=sqlite:///./app.db")
    print("4. For PostgreSQL: DATABASE_URL=postgresql://user:pass@localhost:5432/goia")
    print("\nBackend API will be at: http://localhost:8000")
    print("Frontend at: http://localhost:3000")
    print("\nDocs: http://localhost:8000/docs")
    print("=" * 50)

if __name__ == "__main__":
    setup_development()
