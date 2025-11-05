"""Reflex learning system endpoints.

The reflex learning system helps students solidify knowledge through
repeated exposure and active recall. It consists of a chain of five
stages and simple quizzes. These endpoints return placeholder data
representing a student's progress and quiz results.
"""

from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

reflex_learning_bp = Blueprint('reflex_learning_bp', __name__)


@reflex_learning_bp.route('/reflex-learning/chain', methods=['GET'])
@jwt_required()
def get_reflex_chain():
    """Return the reflex learning chain structure."""
    chain = [
        {"id": 1, "name": "İlk Maruz Kalma", "description": "Konuyla ilk tanışma"},
        {"id": 2, "name": "Hatırlama Denemesi", "description": "Kendi başına geri çağırma"},
        {"id": 3, "name": "Pekiştirme", "description": "Ek örneklerle pekiştirme"},
        {"id": 4, "name": "Uygulama", "description": "Problemleri çözerek uygulama"},
        {"id": 5, "name": "Öğretme", "description": "Başkasına öğreterek pekiştirme"},
    ]
    return jsonify(chain)


@reflex_learning_bp.route('/reflex-learning/reflex/<int:stage_id>', methods=['GET'])
@jwt_required()
def get_reflex_stage(stage_id: int):
    """Return details for a specific reflex stage."""
    if stage_id < 1 or stage_id > 5:
        return jsonify({"error": "Invalid stage id"}), 404
    descriptions = [
        "Konuya göz atarak temel kavramları öğren",
        "Ezber yerine hatırlamaya çalış, küçük sınavlar yap",
        "Ek okuma ve kaynaklarla bilgini güçlendir",
        "Soru çözerek bilgiyi pratiğe dök",
        "Başkalarına anlatarak kendi bilgin pekişsin",
    ]
    return jsonify({
        "stage_id": stage_id,
        "name": ["İlk Maruz Kalma", "Hatırlama Denemesi", "Pekiştirme", "Uygulama", "Öğretme"][stage_id - 1],
        "description": descriptions[stage_id - 1],
        "completion_ratio": 0.2 * stage_id,
    })


@reflex_learning_bp.route('/reflex-learning/quiz/<int:stage_id>', methods=['POST'])
@jwt_required()
def reflex_quiz(stage_id: int):
    """Evaluate a simple quiz for the given reflex stage."""
    data = request.get_json() or {}
    answers = data.get('answers', {})
    # In a real implementation you would evaluate the answers. Here we
    # simulate a score based on the number of answers provided.
    score = len(answers) * 10
    return jsonify({
        "stage_id": stage_id,
        "score": score,
        "correct_answers": score // 10,
        "total_questions": max(1, len(answers)),
    })