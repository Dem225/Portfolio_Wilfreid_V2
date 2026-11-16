
from datetime import datetime

from sqlalchemy import String, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    title: Mapped[str] = mapped_column(String(150), nullable=False)

    slug: Mapped[str] = mapped_column(
        String(180),
        unique=True,
        nullable=False
    )

    description: Mapped[str] = mapped_column(Text, nullable=False)

    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    github_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    demo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    youtube_url: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    technologies: Mapped[list[str]] = mapped_column(JSON, default=list)

    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )
