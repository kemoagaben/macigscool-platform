"""Photo solver (OCR and video explanation) endpoints.

This blueprint provides rudimentary OCR capabilities to extract text
from uploaded images or PDFs and stubs for video generation and
credit management. The OCR pipeline uses Pillow and pytesseract
when available, falling back to returning an empty result if these
libraries are not installed. For production, consider adding error
handling, queueing long running jobs and tightening input validation.
"""

from __future__ import annotations

import base64
import io
import json
import random
from typing import Any, Dict

from flask import Blueprint, jsonify, request, current_app

# Optional OCR dependencies. If they are unavailable the analyze
# endpoints will still work but return empty results.
try:
    from PIL import Image  # type: ignore
except Exception:  # pragma: no cover
    Image = None  # type: ignore
try:
    import pytesseract  # type: ignore
except Exception:  # pragma: no cover
    pytesseract = None  # type: ignore

photo_solver_bp = Blueprint('photo_solver_bp', __name__)


def _extract_text(image_stream: io.BytesIO) -> str:
    """Helper that performs OCR on the provided image stream."""
    if Image is None or pytesseract is None:
        return ""
    try:
        image = Image.open(image_stream)
        if current_app.config.get('TESSERACT_CMD'):
            pytesseract.pytesseract.tesseract_cmd = current_app.config['TESSERACT_CMD']  # type: ignore[attr-defined]
        text = pytesseract.image_to_string(image, lang='tur')
        return text
    except Exception as exc:  # pragma: no cover
        current_app.logger.warning(f"OCR failed: {exc}")
        return ""


@photo_solver_bp.route('/photo-solver/analyze', methods=['POST'])
def analyze_photo() -> Any:
    """Accept an image/PDF and extract text using OCR."""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    # Read the file into memory. We do not save it to disk for simplicity.
    stream = io.BytesIO(file.read())
    text = _extract_text(stream)
    return jsonify({"filename": file.filename, "text": text})


@photo_solver_bp.route('/photo-solver/detailed-analysis', methods=['POST'])
def detailed_analysis() -> Any:
    """Perform a more detailed analysis of the uploaded image/PDF."""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    stream = io.BytesIO(file.read())
    text = _extract_text(stream)
    # Fake some metadata about the problem: difficulty, detected subject
    difficulty = random.choice(['kolay', 'orta', 'zor'])  # type: ignore[name-defined]
    subject = random.choice(['matematik', 'fizik', 'kimya', 'biyoloji'])  # type: ignore[name-defined]
    return jsonify({
        "filename": file.filename,
        "text": text,
        "difficulty": difficulty,
        "subject": subject,
    })


@photo_solver_bp.route('/photo-solver/generate-video', methods=['POST'])
def generate_video() -> Any:
    """Stub endpoint for generating a video explanation.

    Accepts a JSON payload with problem description or steps. Returns
    dummy video metadata. In production this would trigger a video
    rendering pipeline and return a URL or identifier to retrieve the
    finished video.
    """
    data = request.get_json() or {}
    problem = data.get('problem') or 'Bilinmeyen sorun'
    return jsonify({
        "success": True,
        "video_url": "https://example.com/videos/dummy.mp4",
        "description": f"Video explanation for: {problem}",
    })


@photo_solver_bp.route('/photo-solver/earn-credits', methods=['POST'])
def earn_credits() -> Any:
    """Increment a user's credits for using the photo solver.

    This endpoint accepts ``user_id`` and optional ``amount`` in the
    JSON body and returns the updated credit balance. Since we don't
    persist state, the returned balance is purely illustrative.
    """
    data = request.get_json() or {}
    user_id = data.get('user_id')
    amount = data.get('amount', 1)
    if user_id is None:
        return jsonify({"error": "user_id is required"}), 400
    # Simulate an updated credit balance
    new_balance = 10 + amount
    return jsonify({"user_id": user_id, "new_credit_balance": new_balance})