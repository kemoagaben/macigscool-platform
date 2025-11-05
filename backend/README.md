# MagicScool Backend

This directory contains a Flask application that powers the MagicScool
education platform. The app exposes a REST API implemented as a
collection of modular blueprints. Each blueprint encapsulates a set of
related endpoints such as authentication, AI avatar interactions,
exam practice, OCR services, reflex learning, live system metrics and
teacher‑oriented tools.

## Running the application locally

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate  # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and adjust the values as needed. At a
minimum you should set a `JWT_SECRET_KEY` for token signing. If you
wish to enable high‑quality text‑to‑speech set an `OPENAI_API_KEY`.

3. Start the development server:

```bash
python app.py
```

The API will be available at `http://localhost:5000/api`.

## Endpoints

### Authentication & Users

| Method | Path                          | Description |
|-------:|-------------------------------|-------------|
| POST   | `/api/auth/register`          | Register a new user |
| POST   | `/api/auth/login`             | Authenticate and receive a JWT |
| GET    | `/api/users/profile`          | Retrieve the authenticated user's profile |
| GET/POST | `/api/users/<id>/progress`   | Get or update a user's learning progress |
| GET/POST | `/api/users/<id>/achievements` | Get or update a user's achievements |

### AI Avatar & Personalities

| Method | Path                             | Description |
|-------:|----------------------------------|-------------|
| GET    | `/api/personalities`             | List available AI teacher personalities |
| GET    | `/api/emotions`                  | List recognized emotional states |
| GET    | `/api/stats`                     | High level stats about AI avatar usage |
| POST   | `/api/chat`                      | Chat with a selected personality |
| POST   | `/api/voice/synthesize`          | Convert text to speech (uses OpenAI if available) |
| POST   | `/api/emotion/analyze`           | Analyze the emotional tone of text |

### Comprehensive Exam System

| Method | Path                            | Description |
|-------:|---------------------------------|-------------|
| GET    | `/api/system-stats`             | Return exam system statistics |
| GET    | `/api/exam-systems`             | List supported exam types |
| POST   | `/api/practice-test`            | Start a practice test (returns dummy questions) |
| GET    | `/api/performance/<id>`         | Get user performance analytics |

### Photo Solver (OCR & Video)

| Method | Path                                 | Description |
|-------:|--------------------------------------|-------------|
| POST   | `/api/photo-solver/analyze`           | Extract text from an uploaded image/PDF |
| POST   | `/api/photo-solver/detailed-analysis` | Return extended analysis of the uploaded file |
| POST   | `/api/photo-solver/generate-video`    | Stub: generate a video explanation |
| POST   | `/api/photo-solver/earn-credits`      | Stub: earn solver credits |

### Reflex Learning System

| Method | Path                                 | Description |
|-------:|--------------------------------------|-------------|
| GET    | `/api/reflex-learning/chain`          | List the five stages of reflex learning |
| GET    | `/api/reflex-learning/reflex/<id>`     | Get details for a specific stage |
| POST   | `/api/reflex-learning/quiz/<id>`      | Submit quiz answers for a stage |

### Live Metrics

| Method | Path                            | Description |
|-------:|---------------------------------|-------------|
| GET    | `/api/live-metrics/current`     | Current system metrics |
| GET    | `/api/live-metrics/historical`  | Hourly metrics for the last hour |
| GET    | `/api/live-metrics/alerts`      | Current alert statuses |
| GET    | `/api/live-metrics/summary`     | Aggregated metrics summary |

### Vizyon Türkiye AI

| Method | Path                                 | Description |
|-------:|--------------------------------------|-------------|
| GET    | `/api/stats`                          | Statistics about teacher usage |
| POST   | `/api/chat`                           | Teacher chat interface |
| POST   | `/api/lesson-plan/generate`           | Generate a lesson plan |
| POST   | `/api/questions/generate`             | Generate practice questions |

## Notes

- Authentication is required for most endpoints. Use the JWT returned
  from `/api/auth/login` in an `Authorization: Bearer <token>` header.
- The OCR and TTS functionalities depend on external libraries
  (`pytesseract`, `pyttsx3`, `openai`) which are optional. Without
  them, the server will still run but return empty results for
  analysis and use offline TTS only.
- This code is provided as a starting point. You should harden
  validation, error handling and replace the placeholder responses
  with integrations to your real data sources and AI services.