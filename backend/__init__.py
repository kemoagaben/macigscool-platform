"""Initialize the backend package.

This module exposes the factory function used to create the Flask app.
Importing ``create_app`` from this package will construct a new
application instance. The actual route definitions live in
``backend/routes``.
"""

from .app import create_app  # noqa: F401