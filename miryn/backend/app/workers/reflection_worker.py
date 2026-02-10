"""Background worker for reflection tasks."""

import asyncio
from celery import Celery
from app.services.reflection_engine import ReflectionEngine
from app.services.llm_service import LLMService

celery_app = Celery(__name__)
celery_app.conf.broker_url = "redis://localhost:6379/0"
celery_app.conf.result_backend = "redis://localhost:6379/0"


@celery_app.task(name="reflection.analyze")
def analyze_reflection(user_id: str, conversation: dict):
    llm = LLMService()
    engine = ReflectionEngine(llm)
    return asyncio.run(engine.analyze_conversation(user_id=user_id, conversation=conversation))
