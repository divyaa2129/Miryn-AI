import type { Message } from "@/lib/types";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const alignment = isUser ? "justify-end" : "justify-start";
  const palette = isSystem
    ? "bg-red-500/10 border-red-500/20 text-red-100"
    : isUser
      ? "bg-white/10 border-white/10 text-white"
      : "bg-white/5 border-white/10 text-white";

  return (
    <div className={`flex ${alignment}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${palette}`}>
        {message.content}
      </div>
    </div>
  );
}
