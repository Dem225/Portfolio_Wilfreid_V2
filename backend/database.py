from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession
)

from models.base import Base
from models.project import Project
from models.skill import Skill
from models.formation import Formation
from models.contact_message import ContactMessage
from models.admin import Admin
DATABASE_URL = "sqlite+aiosqlite:///./portfolio.db"


engine = create_async_engine(
    DATABASE_URL,
    echo=True
)


SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db():
    async with SessionLocal() as db:
        yield db


async def create_tables():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
