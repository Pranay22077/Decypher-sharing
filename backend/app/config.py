from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Decypher by Epoch API"
    environment: str = "development"
    database_url: str = "sqlite:///./decypher.db"
    jwt_secret_key: str = "local-demo-change-me"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 30
    refresh_token_hours: int = 24
    frontend_url: str = "http://localhost:8443"
    public_base_url: str = "http://localhost:8443"

    storage_provider: str = "filesystem"
    storage_path: str = "./data/uploads"
    minio_endpoint: str = "minio:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin123"
    minio_bucket: str = "evidence"
    minio_secure: bool = False

    neo4j_uri: str = "bolt://neo4j:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "ige_dev_password"
    blockchain_bridge_url: str = "http://blockchain-bridge:8787"

    aws_region: str = "eu-north-1"
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_s3_bucket: str = "criminal-intel-evidence"
    aws_sqs_queue_url: str = ""
    openai_api_key: str = ""
    max_upload_bytes: int = 104_857_600


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

