"""User model definition.

Defines a simple user with an identifier, username, email and hashed
password. In a production setting you would expand this model with
additional fields (e.g. roles, timestamps) and move the password
handling into a dedicated utility, but this suffices for a learning
platform prototype.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from werkzeug.security import generate_password_hash

from ..app import db


@dataclass
class User(db.Model):  # type: ignore[misc]
    """SQLAlchemy model for users."""

    __tablename__ = 'users'

    id: int = db.Column(db.Integer, primary_key=True)
    username: str = db.Column(db.String(64), unique=True, nullable=False)
    email: str = db.Column(db.String(120), unique=True, nullable=False)
    password_hash: str = db.Column(db.String(256), nullable=False)

    def __init__(self, username: str, email: str, password_hash: Optional[str] = None) -> None:
        self.username = username
        self.email = email
        if password_hash:
            # When provided explicitly (e.g. during data seeding) trust the
            # caller. Otherwise generate the hash from ``username`` as a
            # placeholder; real password setting happens via dedicated
            # helper functions in the user routes.
            self.password_hash = password_hash
        else:
            self.password_hash = generate_password_hash(username)

    def __repr__(self) -> str:
        return f"<User {self.username}>"