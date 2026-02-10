export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
};

export type EmotionInsight = {
  primary_emotion?: string;
  intensity?: number;
  secondary_emotions?: string[];
};

export type ConversationInsights = {
  entities?: string[];
  emotions?: EmotionInsight;
  topics?: string[];
  patterns?: {
    topic_co_occurrences?: Array<{ topics: string[]; frequency: number; pattern: string }>;
    temporal_emotional_patterns?: Array<{ day: string; emotion: string; frequency: number; pattern: string }>;
  };
  insights?: string;
};

export type ChatResponsePayload = {
  response: string;
  conversation_id: string;
  insights?: ConversationInsights;
};

export type Identity = {
  id: string;
  user_id: string;
  version: number;
  state: string;
  traits: Record<string, any>;
  values: Record<string, any>;
  beliefs: any[];
  open_loops: any[];
};
