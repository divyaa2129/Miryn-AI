import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-void text-white">
      <div className="grid grid-cols-12">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-white/10 min-h-screen p-6">
          <div className="text-xl font-light tracking-wide">Miryn</div>
          <nav className="mt-8 space-y-3 text-sm text-secondary">
            <Link className="block hover:text-white" href="/chat">
              Chat
            </Link>
            <Link className="block hover:text-white" href="/onboarding">
              Onboarding
            </Link>
            <Link className="block hover:text-white" href="/identity">
              Identity
            </Link>
          </nav>
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-10 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
