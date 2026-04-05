#!/usr/bin/env python3
"""
Database migration setup for GOIA
Run: alembic upgrade head
"""

import subprocess

def run_migrations():
    """Run all migrations"""
    print("Running database migrations...")
    
    try:
        subprocess.run(["alembic", "upgrade", "head"],
                      check=True,
                      cwd="./packages/api")
        print("Migrations complete!")
    except subprocess.CalledProcessError as e:
        print(f"Migration failed: {e}")
        raise

if __name__ == "__main__":
    run_migrations()
