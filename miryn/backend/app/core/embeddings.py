import hashlib
import math
from typing import List


class EmbeddingService:
    """
    Slim embeddings: deterministic hashing-based vector.
    Fast, zero heavy ML deps. Replace with real embeddings later.
    """

    def __init__(self, dim: int = 384):
        self.dim = dim

    def embed(self, text: str) -> List[float]:
        if not text:
            basis = [0.0] * self.dim
            if self.dim:
                basis[0] = 1.0
            return basis
        digest = hashlib.sha256(text.encode("utf-8")).digest()
        vec = [0.0] * self.dim
        for i in range(self.dim):
            b = digest[i % len(digest)]
            vec[i] = (b / 127.5) - 1.0
        norm = math.sqrt(sum(v * v for v in vec)) or 1.0
        return [v / norm for v in vec]

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.embed(t) for t in texts]


embedding_service = EmbeddingService()
