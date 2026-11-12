from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.admin import Admin
from schemas.admin_schema import AdminCreate
from core.security import hash_password, verify_password


# Créer un administrateur
async def create_admin(
    db: AsyncSession,
    admin_data: AdminCreate
):
    result = await db.execute(
        select(Admin).where(Admin.email == admin_data.email)
    )

    existing_admin = result.scalar_one_or_none()

    if existing_admin:
        return None

    new_admin = Admin(
        email=admin_data.email,
        hashed_password=hash_password(admin_data.password)
    )

    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)

    return new_admin


# Récupérer un administrateur par son email
async def get_admin_by_email(
    db: AsyncSession,
    email: str
):
    result = await db.execute(
        select(Admin).where(Admin.email == email)
    )

    return result.scalar_one_or_none()


# Vérifier les identifiants
async def authenticate_admin(
    db: AsyncSession,
    email: str,
    password: str
):
    admin = await get_admin_by_email(db, email)

    if admin is None:
        return None

    if not verify_password(password, admin.hashed_password):
        return None

    return admin