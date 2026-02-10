from typing import Optional
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
import asyncio
import os
import logging
from app.config import settings


class LLMService:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.logger = logging.getLogger(__name__)

        if self.provider == "openai":
            if not settings.OPENAI_API_KEY:
                raise ValueError("OPENAI_API_KEY is required when LLM_PROVIDER=openai")
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            self.model = "gpt-4o-mini"
        elif self.provider == "anthropic":
            if not settings.ANTHROPIC_API_KEY:
                raise ValueError("ANTHROPIC_API_KEY is required when LLM_PROVIDER=anthropic")
            self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            self.model = "claude-3-5-sonnet-20241022"
        elif self.provider == "gemini":
            import google.generativeai as genai

            key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
            if key:
                os.environ["GOOGLE_API_KEY"] = key
            else:
                raise ValueError("A Gemini API key is required when LLM_PROVIDER=gemini")
            genai.configure(api_key=key)
            self.client = genai
            self.model = settings.GEMINI_MODEL
        elif self.provider == "vertex":
            from vertexai import init as vertex_init
            from vertexai.generative_models import GenerativeModel

            if not settings.VERTEX_PROJECT_ID:
                raise ValueError("VERTEX_PROJECT_ID is required for Vertex provider")
            if not settings.VERTEX_MODEL:
                raise ValueError("VERTEX_MODEL is required for Vertex provider")
            vertex_init(project=settings.VERTEX_PROJECT_ID, location=settings.VERTEX_LOCATION)
            self.client = GenerativeModel
            self.model = settings.VERTEX_MODEL
        else:
            raise ValueError(f"Unsupported LLM provider: {self.provider}")

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_tokens: int = 1000,
    ) -> str:
        if self.provider == "openai":
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.7,
            )
            choices = getattr(response, "choices", None) or []
            if not choices:
                raise RuntimeError("OpenAI response did not return any choices")
            content = getattr(choices[0].message, "content", None)
            if not content:
                raise RuntimeError("OpenAI response was empty")
            return content

        if self.provider == "anthropic":
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                system=system_prompt or "",
                messages=[{"role": "user", "content": prompt}],
            )
            content_blocks = getattr(response, "content", None) or []
            if not content_blocks:
                raise RuntimeError("Anthropic response did not include content blocks")
            primary = content_blocks[0]
            text = getattr(primary, "text", None)
            if text is None:
                raise RuntimeError("Anthropic response was empty")
            return text

        if self.provider == "gemini":
            # Gemini SDK is sync; run in thread
            def _run():
                text = prompt
                if system_prompt:
                    text = f"{system_prompt}\n\n{prompt}"

                candidates = [
                    self.model,
                    "gemini-1.5-flash-001",
                    "gemini-1.5-flash-8b",
                    "gemini-1.5-flash",
                    "gemini-1.5-pro",
                    "gemini-1.0-pro",
                ]

                last_error = None
                for m in candidates:
                    try:
                        model = self.client.GenerativeModel(m)
                        res = model.generate_content(text)
                        return getattr(res, "text", "") or ""
                    except Exception as e:
                        last_error = e
                        continue

                # Final fallback: discover available models and try first that supports generateContent
                try:
                    available = self.client.list_models()
                    for mdl in available:
                        methods = getattr(mdl, "supported_generation_methods", []) or []
                        if "generateContent" in methods:
                            try:
                                model = self.client.GenerativeModel(mdl.name)
                                res = model.generate_content(text)
                                return getattr(res, "text", "") or ""
                            except Exception as e:
                                last_error = e
                                continue
                except Exception as e:
                    last_error = e

                if last_error:
                    raise last_error
                return ""

            return await asyncio.to_thread(_run)

        if self.provider == "vertex":
            def _run_vertex():
                model_name = self.model
                # Vertex SDK expects model garden ID (e.g. gemini-2.0-flash-lite-001)
                # or full resource name. Strip "google/" if provided.
                if model_name.startswith("google/"):
                    model_name = model_name.replace("google/", "", 1)
                model = self.client(model_name)
                text = prompt
                if system_prompt:
                    text = f"{system_prompt}\n\n{prompt}"
                res = model.generate_content(text)
                return getattr(res, "text", "") or ""

            return await asyncio.to_thread(_run_vertex)

        raise ValueError(f"Unsupported LLM provider: {self.provider}")

    async def chat(self, context: dict, user_message: str, identity: dict) -> str:
        system_prompt = self._build_system_prompt(identity)
        context_text = self._format_context(context)

        full_prompt = f"""
        {context_text}

        Current message: {user_message}

        Respond as Miryn, keeping in mind:
        - You remember past conversations (shown above)
        - You notice patterns in the user's behavior
        - You are honest, empathetic, and reflective
        - You ask thoughtful follow-up questions
        """

        return await self.generate(
            full_prompt,
            system_prompt=system_prompt,
            max_tokens=500,
        )

    def _build_system_prompt(self, identity: dict) -> str:
        traits = identity.get("traits", {})
        values = identity.get("values", {})
        open_loops = identity.get("open_loops", [])

        prompt = f"""
        You are Miryn, an AI companion with deep memory and reflective capabilities.

        You are talking to a user with these characteristics:
        - Personality traits: {traits}
        - Core values: {values}
        - Ongoing topics to track: {[loop.get('topic') for loop in open_loops]}

        Your purpose is to:
        1. Remember everything the user shares
        2. Notice patterns in their behavior and emotions
        3. Reflect insights back to them gently
        4. Be honest, not just supportive
        5. Ask thoughtful questions

        Speak naturally, like a thoughtful friend who truly knows them.
        """

        return prompt

    def _format_context(self, context: dict) -> str:
        memories = context.get("memories", [])
        patterns = context.get("patterns", {})

        context_parts = []
        if memories:
            context_parts.append("Relevant past conversations:")
            for mem in memories[:5]:
                context_parts.append(f"- {mem.get('content', '')}")

        if patterns:
            context_parts.append("\nDetected patterns:")
            context_parts.append(str(patterns))

        return "\n".join(context_parts)
