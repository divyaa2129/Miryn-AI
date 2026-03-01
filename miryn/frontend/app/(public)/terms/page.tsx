import Link from "next/link";

export default function TermsOfService() {
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
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white mb-4">Terms of Service</h1>
          <p className="text-[#666666] text-sm italic">Last updated: March 1, 2026</p>
        </header>

        <div className="space-y-12 leading-relaxed text-sm text-[#a0a0a0]">
          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white uppercase tracking-tight">01 // The Nature of Miryn</h2>
            <p>
              Miryn is an AI-powered companion designed for personal reflection and identity mapping. It is a tool for self-discovery, not a medical device.
            </p>
            <div className="p-6 border border-[#c8b8ff]/20 bg-[#c8b8ff]/5 rounded-2xl text-white italic font-serif">
              &quot;Miryn is not a substitute for professional mental health support, therapy, or medical advice.&quot;
            </div>
            <p>
              If you are in a crisis, please contact professional services immediately.
              <br />
              <span className="text-white">Crisis Resource:</span> National Suicide Prevention Lifeline: 988 (USA) or your local emergency services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white uppercase tracking-tight">02 // Access Requirements</h2>
            <p>
              You must be at least <span className="text-white">18 years of age</span> to use Miryn. By initializing access, you confirm you meet this requirement. There are no exceptions to this age limit.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white uppercase tracking-tight">03 // Acceptable Use</h2>
            <p>
              Miryn is a quiet room for honest reflection. To maintain this space, we prohibit:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Generating or storing illegal content.</li>
              <li>Attempting to manipulate the AI to produce harmful, hateful, or violent outputs.</li>
              <li>Automated scraping, reverse engineering, or attempting to extract our underlying architecture.</li>
              <li>Using the service to impersonate others or violate their privacy.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white uppercase tracking-tight">04 // No Warranty</h2>
            <p>
              Miryn is currently provided <span className="text-white italic">&quot;as-is&quot;</span> during its alpha phase. We make no guarantees regarding:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The accuracy or truthfulness of AI-generated insights.</li>
              <li>The 100% uptime of the service.</li>
              <li>The persistence of data during system-wide architectural updates.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-white uppercase tracking-tight">05 // Changes to the Protocol</h2>
            <p>
              We may update these terms as Miryn evolves. For material changes, we will notify you via the email associated with your account at least <span className="text-white">7 days</span> in advance. Your continued use of the service after such changes constitutes acceptance.
            </p>
          </section>

          <section className="space-y-4 pt-8 border-t border-white/5">
            <h2 className="text-sm uppercase tracking-[0.2em] text-white font-bold">Agreement</h2>
            <p>
              By initializing your connection to Miryn, you agree to these terms in their entirety.
            </p>
            <p>
              Questions? Contact <a href="mailto:sahil@miryn.ai" className="text-[#c8b8ff] hover:underline">sahil@miryn.ai</a>.
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
