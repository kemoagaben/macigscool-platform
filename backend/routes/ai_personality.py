"""AI Avatar and personality endpoints.

This blueprint exposes endpoints for interacting with the AI powered
"teacher". It includes endpoints to list available personalities,
perform simple chat interactions, synthesize speech from text and
analyze emotions in user messages. The implementation is intentionally
lightweight and can be extended to integrate with large language
models or emotional analysis services.
"""

from __future__ import annotations

import base64
import io
import json
import random
from typing import Any, Dict, List

from flask import Blueprint, jsonify, request, current_app

# Optional dependencies. We import them lazily so the app still
# functions if they are not installed. If OpenAI or TTS fails, we
# fallback to the offline pyttsx3 engine.
try:
    import openai  # type: ignore
except Exception:  # pragma: no cover
    openai = None
try:
    import pyttsx3  # type: ignore
except Exception:  # pragma: no cover
    pyttsx3 = None


ai_personality_bp = Blueprint('ai_personality_bp', __name__)


@ai_personality_bp.route('/personalities', methods=['GET'])
def list_personalities() -> Any:
    """Return the list of available AI teacher personalities."""
    return jsonify([
        {
            "id": "empathetic",
            "name": "Empatik Öğretmen",
            "description": "Sabırlı, destekleyici ve duygulara odaklanan bir öğretmen.",
        },
        {
            "id": "socratic",
            "name": "Sokratik Mentor",
            "description": "Soru sorarak öğrencinin düşünmesini sağlayan rehber.",
        },
        {
            "id": "encouraging",
            "name": "Cesaretlendirici Koç",
            "description": "Motivasyonu artıran ve öğrenme sürecini eğlenceli kılan bir koç.",
        },
        {
            "id": "analytical",
            "name": "Analitik Uzman",
            "description": "Veri ve problem çözme odaklı, doğrudan geri bildirim veren uzman.",
        },
    ])


@ai_personality_bp.route('/emotions', methods=['GET'])
def list_emotions() -> Any:
    """Return a list of possible emotional states recognized by the system."""
    return jsonify([
        "mutlu", "üzgün", "heyecanlı", "kaygılı", "sakin", "kızgın"
    ])


@ai_personality_bp.route('/stats', methods=['GET'])
def personality_stats() -> Any:
    """Return placeholder statistics about AI avatars (demo data)."""
    return jsonify({
        "active_sessions": 42,
        "messages_today": 1234,
        "average_response_time_ms": 400,
    })


@ai_personality_bp.route('/chat', methods=['POST'])
def chat_with_avatar() -> Any:
    """Simulate a chat conversation with the selected personality.

    Accepts JSON with ``message`` (the student's input), ``personality`` (the
    avatar id) and optional ``history`` (list of prior messages). Returns a
    simple echo or templated response. Extend this function to connect
    your own conversational AI.
    """
    data = request.get_json() or {}
    message: str = (data.get('message') or '').strip()
    personality_id: str = (data.get('personality') or 'empathetic').strip()

    if not message:
        return jsonify({"error": "Message is required"}), 400

    # Very simple response generation based on personality. In a real
    # implementation you would call an LLM or your own service here.
    if personality_id == 'socratic':
        reply = f"Bu harika bir soru! Sen ne düşünüyorsun?"
    elif personality_id == 'encouraging':
        reply = f"Çok iyi gidiyorsun! Devam et, {message} hakkında daha fazla düşünelim."
    elif personality_id == 'analytical':
        reply = f"{message} ifadesini adım adım analiz edelim. İlk olarak verilenleri not alalım."
    else:  # empathetic or unknown
        reply = f"Anladım, {message}. Bu konu hakkında neyin zor geldiğini biraz daha anlatır mısın?"
    return jsonify({"reply": reply})


@ai_personality_bp.route('/voice/synthesize', methods=['POST'])
def synthesize_voice() -> Any:
    """Convert text to speech and return audio encoded as base64.

    The request JSON must include a ``text`` field. Optionally accepts
    ``voice`` and ``model`` to customize the TTS engine. If an OpenAI
    API key is configured in the environment, the service attempts to
    use OpenAI's TTS; otherwise it falls back to a local pyttsx3 engine.
    """
    data = request.get_json() or {}
    text: str = (data.get('text') or '').strip()
    voice: str | None = data.get('voice')
    model: str | None = data.get('model')

    if not text:
        return jsonify({"error": "Text is required"}), 400

    app = current_app
    api_key: str | None = app.config.get('OPENAI_API_KEY')

    # First attempt: use OpenAI TTS if configured and importable
    if api_key and openai is not None:
        try:
            openai.api_key = api_key
            # Choose model and voice from request or config
            tts_model = model or app.config.get('OPENAI_TTS_MODEL', 'gpt-4o-mini-tts')
            tts_voice = voice or app.config.get('OPENAI_TTS_VOICE', 'alloy')
            # Prepare the request. The API may raise an exception if
            # something goes wrong (e.g. invalid key).
            response = openai.audio.speech.create(
                model=tts_model,
                voice=tts_voice,
                input=text,
            )
            audio_bytes: bytes = response.content  # type: ignore[assignment]
            encoded = base64.b64encode(audio_bytes).decode('utf-8')
            return jsonify({
                "success": True,
                "mime": "audio/mpeg",
                "audio_base64": encoded,
            })
        except Exception as exc:  # pragma: no cover
            # If OpenAI fails we log the error and fall back to offline engine
            app.logger.warning(f"OpenAI TTS failed: {exc}; falling back to pyttsx3.")

    # Fallback: use pyttsx3 for offline synthesis
    if pyttsx3 is None:
        return jsonify({"error": "TTS is unavailable: pyttsx3 not installed"}), 500
    # Create a TTS engine and configure it. We do not persist the engine
    # between requests to avoid concurrency issues.
    engine = pyttsx3.init()
    if voice:
        # Attempt to set the voice; if it fails just ignore
        for v in engine.getProperty('voices'):
            if voice.lower() in v.id.lower():
                engine.setProperty('voice', v.id)
                break
    # Synthesize speech to an in‑memory buffer
    buf = io.BytesIO()
    engine.save_to_file(text, 'temp.wav')
    engine.runAndWait()
    # Read the file back. pyttsx3 doesn't provide a direct in‑memory API
    with open('temp.wav', 'rb') as wav_file:
        wav_data = wav_file.read()
    encoded_audio = base64.b64encode(wav_data).decode('utf-8')
    return jsonify({
        "success": True,
        "mime": "audio/wav",
        "audio_base64": encoded_audio,
    })


@ai_personality_bp.route('/emotion/analyze', methods=['POST'])
def analyze_emotion() -> Any:
    """Analyze the emotional tone of the given text.

    Accepts a JSON body with ``text``. Returns a randomly selected
    emotion with a confidence value to simulate an NLP sentiment
    analysis. Replace this with your own sentiment analyzer or API
    integration for real use cases.
    """
    data = request.get_json() or {}
    text: str = (data.get('text') or '').strip()
    if not text:
        return jsonify({"error": "Text is required"}), 400
    emotions = ['mutlu', 'üzgün', 'heyecanlı', 'kaygılı', 'sakin', 'kızgın']
    emotion = random.choice(emotions)
    confidence = round(random.uniform(0.7, 0.99), 2)
    return jsonify({"emotion": emotion, "confidence": confidence})