from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.admin_service import get_admin_by_email
from core.security import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentification invalide",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = decode_access_token(token)
        admin_id = int(payload["sub"])

    except Exception:
        raise credentials_exception

    from models.admin import Admin

    from sqlalchemy import select

    result = await db.execute(
        select(Admin).where(Admin.id == admin_id)
    )

    admin = result.scalar_one_or_none()

    if admin is None:
        raise credentials_exception

    return admin