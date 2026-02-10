from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import (
    Base,
    UUIDPrimaryKeyMixin,
    CreatedAtMixin,
    MetadataMixin,
    SerializableMixin,
)


class AuditLog(UUIDPrimaryKeyMixin, CreatedAtMixin, MetadataMixin, SerializableMixin, Base):
    __tablename__ = "audit_logs"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    event_type = Column(String(100), nullable=False)
    path = Column(String(255))
    method = Column(String(20))
    status_code = Column(Integer)
    ip = Column(String(64))
    user_agent = Column(Text)
