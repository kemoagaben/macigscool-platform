"""Vizyon Türkiye AI assistant endpoints.

These endpoints provide services targeted at teachers and content
creators. They offer statistics about educator usage, a simple chat
interface, automated lesson plan generation and question generation.
Real implementations would need to integrate with curriculum data and
content creation pipelines.
"""

from __future__ import annotations

import random
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

vizyon_ai_bp = Blueprint('vizyon_ai_bp', __name__)


@vizyon_ai_bp.route('/stats', methods=['GET'])
@jwt_required()
def vizyon_stats():
    """Return basic statistics about the Vizyon Türkiye programme."""
    return jsonify({
        "registered_teachers": 47000,
        "lesson_plans_generated": 12345,
        "questions_generated": 56789,
    })


@vizyon_ai_bp.route('/chat', methods=['POST'])
@jwt_required()
def vizyon_chat():
    """Respond to a teacher's query via chat."""
    data = request.get_json() or {}
    message = (data.get('message') or '').strip()
    if not message:
        return jsonify({"error": "message is required"}), 400
    # Echo chat; real implementation would use a model and teacher profile
    return jsonify({"reply": f"Öğretmen sorunuz alındı: {message}. Size yardımcı olmaktan mutluluk duyarım!"})


@vizyon_ai_bp.route('/lesson-plan/generate', methods=['POST'])
@jwt_required()
def generate_lesson_plan():
    """Generate a simple lesson plan based on the provided subject."""
    data = request.get_json() or {}
    subject = (data.get('subject') or 'belirsiz konu').strip()
    # Return a dummy plan with outline, objectives and activities
    return jsonify({
        "subject": subject,
        "outline": ["Tanıtım", "Kavramlar", "Uygulama", "Değerlendirme"],
        "objectives": [f"Öğrenciler {subject} temel kavramlarını tanımlar"],
        "activities": ["Grup çalışması", "Soru‑cevap", "Sunum"]
    })


@vizyon_ai_bp.route('/questions/generate', methods=['POST'])
@jwt_required()
def generate_questions():
    """Generate a list of multiple choice questions for a given topic."""
    data = request.get_json() or {}
    topic = (data.get('topic') or 'genel konu').strip()
    num = int(data.get('count', 3))
    questions = []
    for i in range(1, num + 1):
        questions.append({
            "id": i,
            "prompt": f"{topic} hakkında soru {i}",
            "options": ["A", "B", "C", "D"],
            "answer": random.choice(["A", "B", "C", "D"]),
        })
    return jsonify({"topic": topic, "questions": questions})