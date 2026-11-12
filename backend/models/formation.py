from datetime import date, datetime

from sqlalchemy import String, Text, Boolean, Date, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class Formation(Base):
    __tablename__ = "formations"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    institution: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    type: Mapped[str] = mapped_column(
        String(50),
        default="Formation"
    )

    start_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    certificate_url: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    is_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )