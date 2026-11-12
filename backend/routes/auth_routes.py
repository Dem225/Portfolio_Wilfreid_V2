from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.admin_schema import AdminResponse
from services import admin_service
from core.security import create_access_token
from dependencies.auth import get_current_admin


router = APIRouter(
    prefix="/auth",
    tags=["Authentification administrateur"]
)


# Connexion administrateur avec OAuth2
@router.post("/login")
async def login_admin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    admin = await admin_service.authenticate_admin(
        db,
        form_data.username,
        form_data.password
    )

    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )

    token = create_access_token(admin.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# Profil de l'administrateur connecté
@router.get("/me", response_model=AdminResponse)
async def get_admin_profile(
    current_admin=Depends(get_current_admin)
):
    return current_admin