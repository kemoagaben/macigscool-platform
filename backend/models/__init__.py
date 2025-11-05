"""Data models package.

SQLAlchemy models for the application live in this package. When
imported, the models are registered with the SQLAlchemy instance
configured in :mod:`backend.app`.
"""

from .user import User  # noqa: F401