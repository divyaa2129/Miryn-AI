"""Convenience exports for schema types."""

from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserOut
from app.schemas.chat import ChatRequest, ChatResponse, ChatHistoryResponse, MessageOut
from app.schemas.identity import IdentityOut, IdentityUpdate
from app.schemas.onboarding import OnboardingCompleteRequest, OnboardingAnswer

__all__ = [
    "SignupRequest",
    "LoginRequest",
    "TokenResponse",
    "UserOut",
    "ChatRequest",
    "ChatResponse",
    "ChatHistoryResponse",
    "MessageOut",
    "IdentityOut",
    "IdentityUpdate",
    "OnboardingCompleteRequest",
    "OnboardingAnswer",
]
