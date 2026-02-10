-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Identities (versioned user personality)
CREATE TABLE IF NOT EXISTS identities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    version INT DEFAULT 1,
    state VARCHAR(50) DEFAULT 'onboarding',
    traits JSONB DEFAULT '{}',
    values JSONB DEFAULT '{}',
    beliefs JSONB DEFAULT '[]',
    open_loops JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, version)
);

  CREATE INDEX IF NOT EXISTS identities_user_id_idx ON identities(user_id);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON conversations(user_id);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    embedding vector(384),
    metadata JSONB DEFAULT '{}',
    importance_score FLOAT DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_embedding_idx
ON messages USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS messages_user_id_idx ON messages(user_id);

-- Onboarding responses
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question VARCHAR(500) NOT NULL,
  answer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION match_messages(
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  user_id_filter uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  importance_score float,
  created_at timestamp,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF query_embedding IS NULL THEN
    RETURN;
  END IF;
  RETURN QUERY
  SELECT
    scored.id,
    scored.content,
    scored.metadata,
    scored.importance_score,
    scored.created_at,
    scored.similarity
  FROM (
    SELECT
      m.id,
      m.content,
      m.metadata,
      m.importance_score,
      m.created_at,
      1 - (m.embedding <=> query_embedding) AS similarity
    FROM messages m
    WHERE m.user_id = user_id_filter
      AND m.embedding IS NOT NULL
  ) AS scored
  WHERE scored.similarity > match_threshold
  ORDER BY scored.similarity DESC
  LIMIT match_count;
END;
$$;

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    path VARCHAR(255),
    method VARCHAR(20),
    status_code INT,
    ip VARCHAR(64),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);
