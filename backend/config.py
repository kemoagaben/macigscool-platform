"""Application configuration module.

This module centralizes configuration values for the Flask application. It
loads environment variables from an optional `.env` file when present and
provides sane defaults for local development. In production you can
override any of these values by setting the appropriate environment
variables (e.g. via your deployment platform).

Example environment configuration (see `.env.example` for a full list):

```
JWT_SECRET_KEY=super-secret-key
DATABASE_URL=sqlite:///app.db
CORS_ALLOWED_ORIGINS=https://example.com,https://app.example.com
OPENAI_API_KEY=sk-...  # optional, enables high‑quality TTS
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=alloy
TESSERACT_CMD=/usr/bin/tesseract  # optional override to find tesseract executable
```

This file is deliberately small; business logic belongs in the route
blueprints. Keeping configuration values in one place makes it easy to
reason about your application and avoid hard‑coding secrets in your code.
"""

import os
from pathlib import Path

from dotenv import load_dotenv


# Determine the base directory of the backend package so we can locate
# the .env file relative to this file regardless of where the app is
# executed from. Using Path objects here avoids stringly typed paths.
BASE_DIR = Path(__file__).resolve().parent

# Load variables from .env if present. This call will silently ignore
# missing files, which is desirable in production where the environment
# variables should already be set at the OS level.
load_dotenv(BASE_DIR / '.env')


class Config:
    """Flask configuration values loaded from the environment."""

    # Flask secrets
    JWT_SECRET_KEY: str = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')

    # SQLAlchemy
    SQLALCHEMY_DATABASE_URI: str = os.environ.get(
        'DATABASE_URL', f"sqlite:///{(BASE_DIR / 'app.db').as_posix()}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # CORS
    CORS_ALLOWED_ORIGINS = [
        origin.strip() for origin in os.environ.get('CORS_ALLOWED_ORIGINS', '*').split(',')
    ]

    # OpenAI TTS
    OPENAI_API_KEY: str | None = os.environ.get('OPENAI_API_KEY')
    OPENAI_TTS_MODEL: str = os.environ.get('OPENAI_TTS_MODEL', 'gpt-4o-mini-tts')
    OPENAI_TTS_VOICE: str = os.environ.get('OPENAI_TTS_VOICE', 'alloy')

    # Tesseract OCR path
    TESSERACT_CMD: str | None = os.environ.get('TESSERACT_CMD')