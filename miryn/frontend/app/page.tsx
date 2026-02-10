"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="hero-shell">
        <header className="mx-auto max-w-6xl px-6 pt-20 pb-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="text-xs uppercase tracking-[0.35em] text-secondary">
              Project Miryn
            </div>
          </motion.div>
          <motion.h1
            className="mt-6 text-5xl md:text-7xl font-serif font-light leading-tight"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            The Memory
            <span className="block">Layer.</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-secondary max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            We taught computers to speak. Now, we are teaching them to listen.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <a
              href="/signup"
              className="inline-flex items-center rounded-full border border-white/10 px-6 py-3 text-sm hover:border-white/30"
            >
              Initialize Access
            </a>
            <a
              href="/login"
              className="inline-flex items-center rounded-full bg-accent text-black px-6 py-3 text-sm"
            >
              Sign in
            </a>
          </motion.div>
        </header>

        <motion.section
          className="mx-auto max-w-6xl px-6 py-14 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fade}
        >
          <div className="text-xs uppercase tracking-[0.35em] text-secondary">01 // The Axiom</div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="text-xl font-serif font-light">
              We use AI as a confessional. We pour out our anxiety, our grief, our dreams.
              The machine responds perfectly. But when you close the tab, it forgets you.
            </div>
            <div className="text-secondary">
              The intimacy is disposable. It creates a “Loneliness Loop”—sharing without being known.
              Miryn is the end of the loop. The first AI designed to witness your life, not just process it.
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-6xl px-6 py-14 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fade}
        >
          <div className="text-xs uppercase tracking-[0.35em] text-secondary">02 // The Solution</div>
          <h2 className="mt-6 text-4xl md:text-5xl font-serif font-light">Miryn.</h2>
          <p className="mt-3 text-secondary text-lg">The Identity Engine.</p>
        </motion.section>

        <motion.section
          className="mx-auto max-w-6xl px-6 py-14 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fade}
        >
          <div className="text-xs uppercase tracking-[0.35em] text-secondary">03 // Capabilities</div>
          <h3 className="mt-6 text-3xl md:text-4xl font-serif font-light">
            A system designed for continuity in a disposable world.
          </h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary">01 :: Persistence</div>
              <div className="mt-3 text-white">Memory with Consequences</div>
              <p className="mt-2 text-secondary">
                Miryn remembers “unfinished business.” If you mention a conflict today, it will ask about the
                resolution next week. It holds the thread of your life so you do not have to keep restarting.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary">02 :: Anti-Dopamine</div>
              <div className="mt-3 text-white">Designed for Silence</div>
              <p className="mt-2 text-secondary">
                We do not optimize for “Time in App.” We optimize for clarity. Miryn pushes you toward real-world action,
                then encourages you to close the screen.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary">03 :: The Mirror</div>
              <div className="mt-3 text-white">Active Inquiry</div>
              <p className="mt-2 text-secondary">
                Most AIs are passive. Miryn is investigative. It notices when you are avoiding a hard truth and
                gently reflects the pattern back to you.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-6xl px-6 py-14 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fade}
        >
          <div className="text-xs uppercase tracking-[0.35em] text-secondary">04 // The Neural Architecture</div>
          <h3 className="mt-6 text-3xl md:text-4xl font-serif font-light">How it Remembers.</h3>
          <p className="mt-4 text-secondary max-w-3xl">
            Miryn uses a proprietary Three-Layer Memory System to simulate human-like recall and context.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary">Layer 1 :: Immediate</div>
              <div className="mt-3 text-white">Session Context (Redis)</div>
              <p className="mt-2 text-secondary">
                Handles the real-time flow of conversation. Detects micro-emotions, tone shifts, and hesitation in the
                current moment.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary">Layer 2 :: Episodic</div>
              <div className="mt-3 text-white">Vector Retrieval (RAG)</div>
              <p className="mt-2 text-secondary">
                Semantic search that allows Miryn to recall specific events (“that fight in November”) from your
                history instantly.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary">Layer 3 :: Core Identity</div>
              <div className="mt-3 text-white">Knowledge Graph (Neo4j)</div>
              <p className="mt-2 text-secondary">
                A persistent web of facts about your values, relationships, and goals. This is the “Soul” that evolves
                as you grow.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-6xl px-6 py-14 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fade}
        >
          <div className="text-xs uppercase tracking-[0.35em] text-secondary">05 // The Master Plan</div>
          <h3 className="mt-6 text-3xl md:text-4xl font-serif font-light">
            We are not just building an app. We are building a protocol.
          </h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary">Phase 01 :: Foundation (Current)</div>
              <div className="mt-3 text-white">The Web Interface</div>
              <p className="mt-2 text-secondary">
                A minimalist text interface focused on deep onboarding and establishing the “Core Identity Graph.”
                We are training the model to understand you, not just language.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary">Phase 02 :: Presence (Q3 2026)</div>
              <div className="mt-3 text-white">The Voice</div>
              <p className="mt-2 text-secondary">
                Async voice journaling. Speak freely. Miryn listens to tone, pause, and hesitation, extracting emotional
                context that text misses.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary">Phase 03 :: Ubiquity (2027)</div>
              <div className="mt-3 text-white">The Identity API</div>
              <p className="mt-2 text-secondary">
                Miryn becomes the identity layer for the web. Bring your “Miryn Profile” to other services—coaching,
                therapy, education—so you never start from zero again.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-6xl px-6 py-14 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fade}
        >
          <div className="text-xs uppercase tracking-[0.35em] text-secondary">06 // The Interface</div>
          <h3 className="mt-6 text-3xl md:text-4xl font-serif font-light">Ask the Mirror.</h3>
          <p className="mt-3 text-secondary">Example prompts that show how Miryn deconstructs reality.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="chip">Audit my Month</span>
            <span className="chip">Reality Check</span>
            <span className="chip">Why am I stuck?</span>
            <span className="chip">Reveal Blind Spots</span>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-6xl px-6 py-14 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fade}
        >
          <div className="text-xs uppercase tracking-[0.35em] text-secondary">07 // The Guild</div>
          <h3 className="mt-6 text-3xl md:text-4xl font-serif font-light">
            We are not looking for employees. We are looking for Architects.
          </h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-white">The Identity Architect</div>
              <div className="mt-2 text-secondary">Backend &amp; Memory Systems</div>
              <p className="mt-2 text-secondary">
                You are not just building APIs. You are building the “Brain” that never forgets. You obsess over
                vector embeddings, retrieval latency, and the ethics of digital memory.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-white">The Interface Sculptor</div>
              <div className="mt-2 text-secondary">Frontend &amp; Interaction</div>
              <p className="mt-2 text-secondary">
                Miryn needs to feel like a quiet room, not a dashboard. You care about typography, micro-interactions,
                and carving silence out of pixels.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-white">The Soul Designer</div>
              <div className="mt-2 text-secondary">Psychology &amp; Prompting</div>
              <p className="mt-2 text-secondary">
                You bridge the gap between code and feeling. You teach the machine how to be honest without being cruel.
                You design the “Voice” in the void.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <a
              className="inline-flex items-center rounded-full border border-white/10 px-6 py-3 text-sm hover:border-white/30"
              href="mailto:worksahilsharma@gmail.com"
            >
              Initialize Contact Protocol
            </a>
          </div>
        </motion.section>

        <motion.section
          className="mx-auto max-w-6xl px-6 py-14 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fade}
        >
          <div className="text-xs uppercase tracking-[0.35em] text-secondary">Founder Signal</div>
          <blockquote className="mt-6 text-xl md:text-2xl font-serif font-light text-white/90 max-w-4xl">
            “We built the internet to connect everyone, but in the process, we became the loneliest generation in history.
            Miryn is not an app. It is a return to the center. A space where technology stops broadcasting and starts remembering.”
          </blockquote>
          <div className="mt-4 text-secondary">— Sahil</div>
        </motion.section>

        <footer className="mx-auto max-w-6xl px-6 py-10 border-t border-white/10 text-xs text-secondary">
          Project Miryn © 2026
        </footer>
      </div>
    </main>
  );
}
