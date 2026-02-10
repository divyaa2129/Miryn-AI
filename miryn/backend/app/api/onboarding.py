import logging
import sys
from fastapi import APIRouter, Depends
from sqlalchemy import text
from app.core.database import get_db, has_sql, get_sql_session
from app.core.security import get_current_user_id
from app.services.identity_engine import IdentityEngine
from app.schemas.onboarding import OnboardingCompleteRequest

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

identity_engine = IdentityEngine()
logger = logging.getLogger(__name__)


@router.post("/complete")
def complete_onboarding(
    payload: OnboardingCompleteRequest,
    user_id: str = Depends(get_current_user_id),
):
    responses = payload.responses or []

    if has_sql():
        with get_sql_session() as session:
            if responses:
                for r in responses:
                    session.execute(
                        text(
                            """
                            INSERT INTO onboarding_responses (user_id, question, answer)
                            VALUES (:user_id, :question, :answer)
                            """
                        ),
                        {"user_id": user_id, "question": r.question, "answer": r.answer},
                    )

            updated = identity_engine.update_identity(
                user_id,
                {
                    "state": "active",
                    "traits": payload.traits,
                    "values": payload.values,
                },
                sql_session=session,
            )

        return {"status": "ok", "identity": updated}

    db = get_db()
    inserted_ids = []

    try:
        if responses:
            inserts = [
                {"user_id": user_id, "question": r.question, "answer": r.answer}
                for r in responses
            ]
            resp = db.table("onboarding_responses").insert(inserts).execute()
            inserted_ids = [row.get("id") for row in (resp.data or []) if row.get("id")]

        updated = identity_engine.update_identity(
            user_id,
            {
                "state": "active",
                "traits": payload.traits,
                "values": payload.values,
            },
        )
    except Exception:
        original_exc = sys.exc_info()
        if inserted_ids:
            try:
                db.table("onboarding_responses").delete().in_("id", inserted_ids).execute()
            except Exception:
                logger.exception("Failed to rollback onboarding responses for user %s", user_id)
        if original_exc[1] is not None and original_exc[2] is not None:
            raise original_exc[1].with_traceback(original_exc[2])
        raise

    return {"status": "ok", "identity": updated}
