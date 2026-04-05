from dotenv import load_dotenv
from pydantic_settings import BaseSettings
import os

load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from .env file"""
    
    # Database
    DATABASE_URL: str = "sqlite:///./app.db"
    DATABASE_ASYNC_URL: str = "sqlite+aiosqlite:///./app.db"
    DATABASE_MAX_OVERFLOW: int = 100
    DATABASE_POOL_SIZE: int = 10
    
    # JWT
    SECRET_KEY: str = "goia-super-secret-key-change-in-production"
    JWT_SECRET_KEY: str = "goia-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE: int = 86400  # seconds (24h)
    JWT_REFRESH_TOKEN_EXPIRE: int = 604800  # seconds (7 days)
    
    # Email
    SMTP_SERVER: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_VERIFICATION_ENABLED: bool = False
    
    # Tenant
    DEFAULT_TENANT_ID: str = ""
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8000"
    
    # Security
    CSRF_ENABLED: bool = True
    TRUST_HOSTS: bool = False
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
