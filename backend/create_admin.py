
import asyncio
from getpass import getpass

from sqlalchemy import select

from database import SessionLocal
from models.admin import Admin
from core.security import hash_password


async def create_admin():
    email = input("Adresse e-mail : ").strip()
    password = getpass("Mot de passe : ")
    confirmation = getpass("Confirmer le mot de passe : ")

    if not email or not password:
        print("Erreur : les champs sont obligatoires.")
        return

    if password != confirmation:
        print("Erreur : les mots de passe ne correspondent pas.")
        return

    async with SessionLocal() as db:
        result = await db.execute(
            select(Admin).where(Admin.email == email)
        )
        existing_admin = result.scalar_one_or_none()

        if existing_admin:
            print("Un administrateur existe déjà avec cet e-mail.")
            return

        admin = Admin(
            email=email,
            hashed_password=hash_password(password)
        )

        db.add(admin)
        await db.commit()

        print("Compte administrateur créé avec succès !")


if __name__ == "__main__":
    asyncio.run(create_admin())
