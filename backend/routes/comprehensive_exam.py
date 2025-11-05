"""Comprehensive exam system endpoints.

This blueprint encapsulates endpoints related to the mock exam system.
It supports retrieving global statistics, listing available exam types,
running practice tests, and retrieving user performance analytics. The
responses are intentionally simple and should be replaced with real
logic when integrating with your question bank or analytics engine.
"""

from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

exam_bp = Blueprint('exam_bp', __name__)


@exam_bp.route('/system-stats', methods=['GET'])
def system_stats():
    """Return summary statistics for the exam system."""
    return jsonify({
        "total_answered_questions": 89000000,
        "active_students": 187000,
        "uptime_percentage": 99.98,
    })


@exam_bp.route('/exam-systems', methods=['GET'])
def list_exam_systems():
    """List all supported exam types."""
    exams = [
        {"id": "yks", "name": "YKS"},
        {"id": "lgs", "name": "LGS"},
        {"id": "kpss", "name": "KPSS"},
        {"id": "dgs", "name": "DGS"},
        {"id": "ales", "name": "ALES"},
        {"id": "ydt", "name": "YDT"},
        {"id": "msu", "name": "MSÜ"},
        {"id": "tyt", "name": "TYT/AYT"},
    ]
    return jsonify(exams)


@exam_bp.route('/practice-test', methods=['POST'])
@jwt_required()
def practice_test():
    """Start a practice test and return dummy questions.

    Expects JSON with ``exam_id`` specifying which exam system the user
    wishes to practice. Returns a set of mock questions. A real
    implementation would pull questions from a database or external
    service.
    """
    data = request.get_json() or {}
    exam_id = (data.get('exam_id') or '').strip().lower()
    if not exam_id:
        return jsonify({"error": "exam_id is required"}), 400
    # In lieu of a real question bank, construct a few sample
    # questions. Each question includes a prompt and options.
    questions = [
        {
            "id": 1,
            "prompt": "1 + 1 kaç eder?",
            "options": ["1", "2", "3", "4"],
            "answer": "2",
        },
        {
            "id": 2,
            "prompt": "Dünyanın uydusunun adı nedir?",
            "options": ["Mars", "Venüs", "Ay", "Jüpiter"],
            "answer": "Ay",
        },
    ]
    return jsonify({"exam_id": exam_id, "questions": questions})


@exam_bp.route('/performance/<int:user_id>', methods=['GET'])
@jwt_required()
def user_performance(user_id: int):
    """Return mock performance analytics for the given user."""
    # In a real application you would check that the current user is
    # authorized to view this user's performance. Here we simply
    # return placeholder metrics.
    return jsonify({
        "user_id": user_id,
        "accuracy": 0.85,
        "average_time_per_question_sec": 30,
        "completed_tests": 12,
    })