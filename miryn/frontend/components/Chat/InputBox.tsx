"use client";

import { useState, useEffect, useRef } from "react";

export default function InputBox({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const canSend = value.trim().length > 0 && !disabled;

  useEffect(() => {
    if (!textareaRef.current) return;
    const element = textareaRef.current;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <form
      className="border-t border-white/10 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        handleSend();
      }}
    >
      <div className="flex items-end gap-3">
        <label className="sr-only" htmlFor="chat-input">
          Message
        </label>
        <textarea
          ref={textareaRef}
          id="chat-input"
          className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm leading-relaxed placeholder:text-white/40 focus:border-white/30 focus:outline-none resize-none"
          placeholder="Say something..."
          value={value}
          rows={1}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          disabled={disabled}
          aria-label="Message"
        />
        <button
          type="submit"
          className="rounded-full bg-accent text-black px-5 py-2 text-sm disabled:opacity-50"
          disabled={!canSend}
          aria-disabled={!canSend}
        >
          {disabled ? "…" : "Send"}
        </button>
      </div>
    </form>
  );
}
