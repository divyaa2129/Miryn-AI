"use client";

import type { ConversationInsights } from "@/lib/types";

export default function InsightsPanel({ insights }: { insights: ConversationInsights | null }) {
  if (!insights) {
    return null;
  }

  const topics = insights.topics || [];
  const entities = insights.entities || [];
  const reflection = insights.insights?.trim();
  const mood = insights.emotions?.primary_emotion;
  const intensity = insights.emotions?.intensity;
  const hasSupplemental = reflection || topics.length > 0 || entities.length > 0 || mood;

  if (!hasSupplemental) {
    return null;
  }

  return (
    <aside className="border-t border-white/10 bg-black/30 px-6 py-4 text-sm space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-secondary">
        <span>Reflection</span>
        {mood && (
          <span className="tracking-normal text-secondary/80">
            Mood: <span className="text-white">{mood}</span>
            {typeof intensity === "number" && (
              <span className="ml-1 text-secondary/60">({Math.round(intensity * 100)}%)</span>
            )}
          </span>
        )}
      </div>
      {reflection && <p className="text-white/80 leading-relaxed">{reflection}</p>}
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <span
            key={`topic-${topic}-${index}`}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
          >
            {topic}
          </span>
        ))}
        {entities.map((entity, index) => (
          <span
            key={`entity-${entity}-${index}`}
            className="inline-flex items-center rounded-full border border-white/5 bg-white/10 px-3 py-1 text-xs text-white"
          >
            {entity}
          </span>
        ))}
      </div>
    </aside>
  );
}
