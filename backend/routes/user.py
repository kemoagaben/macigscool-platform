"""User management routes.

This blueprint contains endpoints for registering users, logging in,
retrieving user profiles and accessing simple progress and achievement
data. The endpoints are intentionally thin: they validate input,
delegate to the underlying models and return JSON responses. For a real
application you would likely separate concerns further (e.g. using
service classes) and add pagination, search, etc.
"""

from __future__ import annotations

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import (
    jwt_required,
    create_access_token,
    get_jwt_identity,
)

from ..app import db
from ..models.user import User


# The blueprint that encapsulates all user related routes. It will be
# registered under the ``/api`` prefix in :mod:`backend.app`.
user_bp = Blueprint('user_bp', __name__)


@user_bp.route('/auth/register', methods=['POST'])
def register_user():
    """Register a new user.

    Expects JSON payload with ``username``, ``email`` and ``password``.
    Returns a simple success message and the new user's ID on success.
    On error (e.g. missing fields or duplicate email), an
    appropriate error code and message are returned.
    """
    data = request.get_json() or {}
    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password')

    if not (username and email and password):
        return jsonify({"error": "username, email and password are required"}), 400
    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "User with this email already exists"}), 409

    user = User(username=username, email=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({"success": True, "user_id": user.id})


@user_bp.route('/auth/login', methods=['POST'])
def login_user():
    """Authenticate a user and return a JWT.

    Requires ``email`` and ``password`` in the JSON body. If the
    credentials are valid, returns a JWT access token. Otherwise
    returns HTTP 401.
    """
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password')

    user: User | None = User.query.filter_by(email=email).first()
    if user is None or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create a short‑lived access token. You can configure expiry via
    # JWT_ACCESS_TOKEN_EXPIRES in Config.
    access_token = create_access_token(identity=user.id)
    return jsonify({"success": True, "access_token": access_token})


@user_bp.route('/users/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Return the authenticated user's profile.

    Uses the identity stored in the JWT to look up the user and
    return their basic details. If the user is not found (e.g.
    deleted after token creation) returns HTTP 404.
    """
    user_id = get_jwt_identity()
    user: User | None = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user.id, "username": user.username, "email": user.email})


# Optional endpoints for progress and achievements. These return
# placeholder data so the frontend can be integrated without waiting
# for a full implementation.
@user_bp.route('/users/<int:user_id>/progress', methods=['GET', 'POST'])
@jwt_required()
def user_progress(user_id: int):
    """Get or update a user's learning progress.

    GET returns a dummy progress record; POST echoes back the posted
    data. In a full implementation you would validate and persist
    progress metrics to the database.
    """
    if request.method == 'GET':
        return jsonify({
            "user_id": user_id,
            "completed_lessons": 5,
            "total_lessons": 10,
            "mastery_level": 0.5,
        })
    # For POST just store the JSON payload (no validation)
    progress_data = request.get_json() or {}
    return jsonify({"user_id": user_id, "progress": progress_data})


@user_bp.route('/users/<int:user_id>/achievements', methods=['GET', 'POST'])
@jwt_required()
def user_achievements(user_id: int):
    """Get or update a user's achievements.

    Returns placeholder achievements. Accepts JSON input for POST but
    does not persist it. Replace with your own logic as needed.
    """
    if request.method == 'GET':
        return jsonify({
            "user_id": user_id,
            "badges": ["Starter", "Math Whiz"],
            "points": 1200,
        })
    achievements_data = request.get_json() or {}
    return jsonify({"user_id": user_id, "achievements": achievements_data})