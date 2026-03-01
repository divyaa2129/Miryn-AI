ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"checkin_reminders": true, "weekly_digest": true, "browser_push": false}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_retention VARCHAR(50) DEFAULT 'forever';
