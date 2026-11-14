
import os

from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)

from models.base import Base
from models.project import Project
from models.skill import Skill
from models.formation import Formation
from models.contact_message import ContactMessage
from models.admin import Admin


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./portfolio.db"
)

database_url = make_url(DATABASE_URL)
connect_args = {}

if database_url.drivername in ("postgresql", "postgresql+asyncpg"):
    database_url = database_url.set(
        drivername="postgresql+asyncpg"
    )

    query_params = dict(database_url.query)
    query_params.pop("sslmode", None)
    query_params.pop("channel_binding", None)

    database_url = database_url.set(query=query_params)
    connect_args = {"ssl": "require"}


engine = create_async_engine(
    database_url,
    echo=False,
    connect_args=connect_args,
)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with SessionLocal() as db:
        yield db


async def create_tables():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
