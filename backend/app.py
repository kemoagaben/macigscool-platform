"""Application factory and entry point.

This module defines ``create_app``, a factory function that instantiates
and configures the Flask application. Using a factory allows the
application to be created with different configurations (e.g. for
testing) and makes it easier to reason about the app’s lifetime.

If executed directly (``python app.py``), this module will create the
app and run it using the built‑in development server.
"""

from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config

# Create the database and JWT manager at module scope so they can be
# imported in model and route modules without circular imports. They
# will be bound to the application in ``create_app``.
db = SQLAlchemy()
jwt = JWTManager()


def create_app() -> Flask:
    """Factory function that builds and configures a Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Bind extensions to the Flask app
    db.init_app(app)
    jwt.init_app(app)

    # Configure CORS. Here we allow credentials and only enable CORS on
    # ``/api/*`` routes. The allowed origins are read from the config.
    CORS(
        app,
        supports_credentials=True,
        resources={r"/api/*": {"origins": app.config.get('CORS_ALLOWED_ORIGINS') or ['*']}},
    )

    # Register blueprints for modular route organization. Each blueprint
    # encapsulates a coherent set of endpoints.
    from .routes.user import user_bp
    from .routes.ai_personality import ai_personality_bp
    from .routes.comprehensive_exam import exam_bp
    from .routes.photo_solver import photo_solver_bp
    from .routes.reflex_learning import reflex_learning_bp
    from .routes.live_metrics import live_metrics_bp
    from .routes.vizyon_ai import vizyon_ai_bp
    from .routes.adaptive_video import adaptive_video_bp

    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(ai_personality_bp, url_prefix='/api')
    app.register_blueprint(exam_bp, url_prefix='/api')
    app.register_blueprint(photo_solver_bp, url_prefix='/api')
    app.register_blueprint(reflex_learning_bp, url_prefix='/api')
    app.register_blueprint(live_metrics_bp, url_prefix='/api')
    app.register_blueprint(vizyon_ai_bp, url_prefix='/api')
    app.register_blueprint(adaptive_video_bp, url_prefix='/api')

    # A simple health check endpoint used for monitoring and automation
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({"status": "ok"})

    return app


# When running this module directly (e.g. ``python app.py``) create
# the application, initialize the database and start the dev server. In
# production you should invoke ``create_app`` from your WSGI server
# configuration (e.g. gunicorn).
if __name__ == '__main__':
    flask_app = create_app()
    with flask_app.app_context():
        # Create database tables if they don't exist. In a real
        # deployment you would use migrations (e.g. Alembic), but
        # ``create_all`` provides a fast and easy starting point.
        db.create_all()
    flask_app.run(host='0.0.0.0', port=5000)