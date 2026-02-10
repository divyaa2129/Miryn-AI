# Miryn AI

Miryn is a context-aware AI companion with persistent memory, reflective insights, and an identity system that evolves over time.

<p>
  <a href="https://miryn-ai.vercel.app">
    <img alt="Live Waitlist" src="https://img.shields.io/badge/Live%20Waitlist-miryn--ai.vercel.app-0f172a?style=for-the-badge" />
  </a>
</p>

## Highlights

- Identity engine with versioned traits, values, beliefs, and open loops
- Hybrid memory layer with semantic recall
- Reflection pipeline for entities and emotions
- FastAPI backend + Next.js frontend

## Quickstart (Docker)

```bash
cd miryn
docker compose up -d --build
```

Backend: http://localhost:8000  
Frontend: http://localhost:3000

## Local Dev

Backend:

```bash
cd miryn/backend
python -m venv .venv
source .venv/bin/activate  # Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Frontend:

```bash
cd miryn/frontend
npm install
npm run dev
```

## Project Structure

```
miryn/
  backend/
  frontend/
  shared/
  docker-compose.yml
```

## Environment

Copy the examples and fill in values:

- `miryn/.env.example` -> `miryn/.env`
- `miryn/backend/.env.example` -> `miryn/backend/.env`
- `miryn/frontend/.env.example` -> `miryn/frontend/.env`

## API (Backend)

- `POST /auth/signup`
- `POST /auth/login`
- `POST /chat/`
- `GET /chat/history`
- `GET /identity/`
- `PATCH /identity/`
- `POST /onboarding/complete`

