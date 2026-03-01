import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#e0e0e0] font-sans selection:bg-[#c8b8ff] selection:text-black">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        <header className="mb-16">
          <Link 
            href="/" 
            className="text-xs uppercase tracking-[0.3em] text-[#a0a0a0] hover:text-white transition-colors mb-8 inline-block"
          >
            ← Back to Void
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white mb-4">Privacy Policy</h1>
          <p className="text-[#666666] text-sm italic">Last updated: March 1, 2026</p>
        </header>

        <div className="space-y-12 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white">01 // What we collect</h2>
            <p className="text-sm text-[#a0a0a0]">
              To provide a space for honest reflection, Miryn requires certain data. We collect your email address for account authentication, the content of your conversations to maintain your memory layer, and the identity profile data (traits, beliefs, and patterns) extracted by our engine.
            </p>
            <p className="text-sm text-[#a0a0a0]">
              We also collect technical data including your IP address, browser type, and timestamps to ensure system security and operational integrity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white">02 // How we use it</h2>
            <p className="text-sm text-[#a0a0a0]">
              Your data is used exclusively to provide the Miryn service and to improve Miryn&apos;s personal understanding of you. 
            </p>
            <ul className="list-disc list-inside text-sm text-[#a0a0a0] space-y-2 ml-4">
              <li>We do <span className="text-white italic">not</span> sell your data.</li>
              <li>We do <span className="text-white italic">not</span> use your conversations to train global AI models without your explicit consent.</li>
              <li>Your data is your own; we are merely the architects of the vault.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white">03 // Memory & Storage</h2>
            <p className="text-sm text-[#a0a0a0]">
              Conversation content is stored encrypted at rest. We implement multi-tier memory (Transient, Episodic, and Core) to handle your data with appropriate levels of persistence. 
            </p>
            <p className="text-sm text-[#a0a0a0]">
              You have full control over your memory. You can delete any specific memory at any time from the Memory page, or choose to erase your entire account and all associated data from the Settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white">04 // Third Parties</h2>
            <p className="text-sm text-[#a0a0a0]">
              To operate this intelligence, we partner with specialized infrastructure providers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono uppercase tracking-wider pt-2">
              <div className="p-4 border border-white/5 bg-white/5 rounded-xl">OpenAI / Anthropic (LLM Processing)</div>
              <div className="p-4 border border-white/5 bg-white/5 rounded-xl">Neon / Supabase (Database)</div>
              <div className="p-4 border border-white/5 bg-white/5 rounded-xl">Vercel / Railway (Hosting)</div>
              <div className="p-4 border border-white/5 bg-white/5 rounded-xl">Resend (Email)</div>
              <div className="p-4 border border-white/5 bg-white/5 rounded-xl">PostHog (Anonymised Analytics)</div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white">05 // Data Ownership</h2>
            <p className="text-sm text-[#a0a0a0]">
              <span className="text-white">Export:</span> You can download your entire history and identity profile at any time from Settings → Privacy → Export my data.
            </p>
            <p className="text-sm text-[#a0a0a0]">
              <span className="text-white">Deletion:</span> Account deletion removes all data from our primary systems within 30 days. To request manual deletion of any remaining logs, contact us directly.
            </p>
          </section>

          <section className="space-y-4 pt-8 border-t border-white/5">
            <h2 className="text-sm uppercase tracking-[0.2em] text-white">Contact</h2>
            <p className="text-sm text-[#a0a0a0]">
              For any questions regarding your data or this policy, reach out to the architect at <a href="mailto:sahil@miryn.ai" className="text-[#c8b8ff] hover:underline">sahil@miryn.ai</a>.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 text-[10px] uppercase tracking-widest text-[#666666]">
          Miryn Intelligence © 2026
        </footer>
      </div>
    </div>
  );
}
