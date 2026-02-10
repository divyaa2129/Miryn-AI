from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, chat, identity, onboarding, llm
from app.core.rate_limit import RateLimitMiddleware

app = FastAPI(
    title="Miryn API",
    description="Context-aware AI companion with persistent memory",
    version="0.1.0",
)

allow_origins = []
if settings.FRONTEND_URL and settings.FRONTEND_URL.strip():
    allow_origins.append(settings.FRONTEND_URL.strip())

allow_origins.extend([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
])
allow_origins = list(dict.fromkeys(allow_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RateLimitMiddleware)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(identity.router)
app.include_router(onboarding.router)
app.include_router(llm.router)


@app.get("/")
def root():
    return {"message": "Miryn API v0.1.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
