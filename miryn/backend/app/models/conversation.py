from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin, SerializableMixin


class Conversation(UUIDPrimaryKeyMixin, TimestampMixin, SerializableMixin, Base):
    __tablename__ = "conversations"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255))
