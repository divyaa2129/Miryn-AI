"""Schemas for authentication flows."""

from pydantic import BaseModel, EmailStr, field_validator


class SignupRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v or len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must be 72 bytes or fewer")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_login_password(cls, v: str) -> str:
        if not v or len(v) < 1:
            raise ValueError("Password required")
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password must be 72 bytes or fewer")
        return v


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: str
    email: EmailStr
