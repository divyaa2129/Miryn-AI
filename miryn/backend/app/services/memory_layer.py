from typing import List, Dict, Any
import math
import json
import asyncio
import hashlib
import logging
from datetime import datetime, timedelta
from sqlalchemy import text
from app.core.database import get_db, has_sql, get_sql_session
from app.core.cache import redis_client
from app.core.embeddings import embedding_service


class MemoryLayer:
    """
    Multi-tiered memory retrieval system.
    Hybrid: semantic + temporal + importance.
    """

    def __init__(self):
        self.cache = redis_client
        self.embedder = embedding_service
        self.supabase = get_db() if not has_sql() else None
        self.logger = logging.getLogger(__name__)

    async def store_conversation(
        self,
        user_id: str,
        role: str,
        content: str,
        conversation_id: str,
        metadata: Dict[str, Any] | None = None,
    ):
        embedding = self.embedder.embed(content)
        meta = metadata or {}
        try:
            await asyncio.to_thread(
                self._persist_message,
                user_id,
                conversation_id,
                role,
                content,
                embedding,
                meta,
            )
        except Exception:
            self.logger.exception("Failed to persist message for user %s", user_id)
            raise

        self._invalidate_cache(user_id)

    async def retrieve_context(
        self,
        user_id: str,
        query: str,
        limit: int = 5,
        strategy: str = "hybrid",
    ) -> List[Dict[str, Any]]:
        cache_key = self._build_cache_key(user_id, query)
        cached = self.cache.get(cache_key)
        if cached:
            try:
                return json.loads(cached)[:limit]
            except Exception:
                pass

        query_embedding = self.embedder.embed(query)

        semantic_results = self._semantic_search(user_id, query_embedding, limit=15)
        temporal_results = self._temporal_search(user_id, days=7, limit=15)
        important_results = self._importance_search(user_id, threshold=0.7, limit=15)

        if strategy == "hybrid":
            scored = self._hybrid_score(semantic_results, temporal_results, important_results)
        elif strategy == "semantic":
            scored = semantic_results
        elif strategy == "temporal":
            scored = temporal_results
        else:
            scored = important_results

        def _json_safe(obj):
            return str(obj)

        try:
            self.cache.setex(cache_key, 3600, json.dumps(scored[:limit], default=_json_safe))
            index_key = self._cache_index_key(user_id)
            self.cache.sadd(index_key, cache_key)
            self.cache.expire(index_key, 3600)
        except Exception:
            self.logger.debug("Failed to cache context for user %s", user_id)
        return scored[:limit]

    def _semantic_search(self, user_id: str, embedding: List[float], limit: int):
        if has_sql():
            vector_literal = self._vector_literal(embedding)
            with get_sql_session() as session:
                result = session.execute(
                    text(
                        """
                        SELECT id, content, metadata, importance_score, created_at,
                               1 - (embedding <=> CAST(:query_embedding AS vector)) as similarity
                        FROM messages
                        WHERE user_id = :user_id
                          AND 1 - (embedding <=> CAST(:query_embedding AS vector)) > :match_threshold
                        ORDER BY embedding <=> CAST(:query_embedding AS vector)
                        LIMIT :match_count
                        """
                    ),
                    {
                        "query_embedding": vector_literal,
                        "match_threshold": 0.7,
                        "match_count": limit,
                        "user_id": user_id,
                    },
                )
                return [dict(row) for row in result.mappings().all()]

        response = self.supabase.rpc(
            "match_messages",
            {
                "query_embedding": embedding,
                "match_threshold": 0.7,
                "match_count": limit,
                "user_id_filter": user_id,
            },
        ).execute()
        return response.data or []

    def _temporal_search(self, user_id: str, days: int, limit: int):
        cutoff = datetime.utcnow() - timedelta(days=days)

        if has_sql():
            with get_sql_session() as session:
                result = session.execute(
                    text(
                        """
                        SELECT * FROM messages
                        WHERE user_id = :user_id
                          AND created_at >= :cutoff
                        ORDER BY created_at DESC
                        LIMIT :limit
                        """
                    ),
                    {
                        "user_id": user_id,
                        "cutoff": cutoff,
                        "limit": limit,
                    },
                )
                return [dict(row) for row in result.mappings().all()]

        response = (
            self.supabase.table("messages")
            .select("*")
            .eq("user_id", user_id)
            .gte("created_at", cutoff.isoformat())
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []

    def _importance_search(self, user_id: str, threshold: float, limit: int):
        if has_sql():
            with get_sql_session() as session:
                result = session.execute(
                    text(
                        """
                        SELECT * FROM messages
                        WHERE user_id = :user_id
                          AND importance_score >= :threshold
                        ORDER BY importance_score DESC
                        LIMIT :limit
                        """
                    ),
                    {
                        "user_id": user_id,
                        "threshold": threshold,
                        "limit": limit,
                    },
                )
                return [dict(row) for row in result.mappings().all()]

        response = (
            self.supabase.table("messages")
            .select("*")
            .eq("user_id", user_id)
            .gte("importance_score", threshold)
            .order("importance_score", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []

    def _hybrid_score(self, semantic, temporal, important):
        alpha = 0.5
        beta = 0.3
        gamma = 0.2

        all_messages: Dict[str, Dict[str, Any]] = {}

        for msg in semantic:
            msg_id = msg["id"]
            all_messages[msg_id] = {
                **msg,
                "semantic_score": msg.get("similarity", 0),
                "recency_score": 0,
                "importance_score": msg.get("importance_score", 0.5),
            }

        for msg in temporal:
            msg_id = msg["id"]
            recency = self._compute_recency(msg.get("created_at"))
            if msg_id in all_messages:
                all_messages[msg_id]["recency_score"] = recency
            else:
                all_messages[msg_id] = {
                    **msg,
                    "semantic_score": 0,
                    "recency_score": recency,
                    "importance_score": msg.get("importance_score", 0.5),
                }

        for msg in important:
            msg_id = msg["id"]
            if msg_id not in all_messages:
                all_messages[msg_id] = {
                    **msg,
                    "semantic_score": 0,
                    "recency_score": 0,
                    "importance_score": msg.get("importance_score", 0.5),
                }

        scored = []
        for msg_id, msg in all_messages.items():
            hybrid_score = (
                alpha * msg["semantic_score"] +
                beta * msg["recency_score"] +
                gamma * msg["importance_score"]
            )
            scored.append({**msg, "hybrid_score": hybrid_score})

        scored.sort(key=lambda x: x["hybrid_score"], reverse=True)
        return scored

    def _compute_recency(self, created_at: str | None) -> float:
        if not created_at:
            return 0.0
        lam = 0.1
        created = datetime.fromisoformat(str(created_at).replace("Z", "+00:00"))
        days_ago = (datetime.now(created.tzinfo) - created).days
        return math.exp(-lam * days_ago)

    def _vector_literal(self, embedding: List[float]) -> str:
        return "[" + ",".join(f"{x:.6f}" for x in embedding) + "]"

    def _persist_message(
        self,
        user_id: str,
        conversation_id: str,
        role: str,
        content: str,
        embedding: List[float],
        metadata: Dict[str, Any],
    ) -> None:
        importance = metadata.get("importance", 0.5)
        if has_sql():
            vector_literal = self._vector_literal(embedding)
            with get_sql_session() as session:
                session.execute(
                    text(
                        """
                        INSERT INTO messages (
                            user_id, conversation_id, role, content, embedding, metadata, importance_score
                        ) VALUES (
                            :user_id, :conversation_id, :role, :content, :embedding, :metadata, :importance_score
                        )
                        """
                    ),
                    {
                        "user_id": user_id,
                        "conversation_id": conversation_id,
                        "role": role,
                        "content": content,
                        "embedding": vector_literal,
                        "metadata": json.dumps(metadata),
                        "importance_score": importance,
                    },
                )
                session.commit()
            return

        if not self.supabase:
            raise RuntimeError("Supabase client is not configured")

        self.supabase.table("messages").insert({
            "user_id": user_id,
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "embedding": embedding,
            "metadata": metadata,
            "importance_score": importance,
        }).execute()

    def _build_cache_key(self, user_id: str, query: str) -> str:
        digest = hashlib.sha256(query.strip().encode("utf-8")).hexdigest()
        return f"session:{user_id}:{digest}"

    def _cache_index_key(self, user_id: str) -> str:
        return f"session:index:{user_id}"

    def _invalidate_cache(self, user_id: str) -> None:
        index_key = self._cache_index_key(user_id)
        try:
            cached_keys = self.cache.smembers(index_key) or []
            if cached_keys:
                keys = [k.decode("utf-8") if isinstance(k, bytes) else k for k in cached_keys]
                self.cache.delete(*keys)
            self.cache.delete(index_key)
        except Exception:
            self.logger.debug("Failed to invalidate cache for user %s", user_id)
