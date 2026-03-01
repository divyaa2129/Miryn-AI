from pydantic import BaseModel


class NotificationPreferences(BaseModel):
    checkin_reminders: bool = True
    weekly_digest: bool = True
    browser_push: bool = False
    data_retention: str = "forever"
