from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/ieltsprep"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    OLLAMA_BASE_URL: str = "http://localhost:11434/v1"
    OLLAMA_MODEL: str = "llama3.2:3b"

    OPENAI_API_KEY: Optional[str] = None

    ESEWA_MERCHANT_CODE: str = ""
    ESEWA_SECRET_KEY: str = ""
    ESEWA_BASE_URL: str = "https://rc-epay.esewa.com.np"

    KHALTI_SECRET_KEY: str = ""
    KHALTI_BASE_URL: str = "https://a.khalti.com/api/v2"

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""

    APP_NAME: str = "IELTSPrep"
    APP_VERSION: str = "1.0.0"
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    DEBUG: bool = True
    CORS_ORIGINS: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
