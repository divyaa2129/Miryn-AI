"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Identity } from "@/lib/types";

export default function IdentityCard() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.loadToken();
    api
      .getIdentity()
      .then(setIdentity)
      .catch((e) => setError(e.message || "Failed to load identity"));
  }, []);

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (!identity) {
    return <div className="text-secondary">Loading identity...</div>;
  }

  return (
    <div className="max-w-2xl border border-white/10 rounded-2xl p-6 bg-white/5">
      <h1 className="text-3xl font-serif font-light">Identity</h1>
      <div className="mt-4 text-sm text-secondary">Version {identity.version}</div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <div className="text-white">Traits</div>
          <pre className="mt-2 text-secondary whitespace-pre-wrap">
            {JSON.stringify(identity.traits, null, 2)}
          </pre>
        </div>
        <div>
          <div className="text-white">Values</div>
          <pre className="mt-2 text-secondary whitespace-pre-wrap">
            {JSON.stringify(identity.values, null, 2)}
          </pre>
        </div>
        <div>
          <div className="text-white">Beliefs</div>
          <pre className="mt-2 text-secondary whitespace-pre-wrap">
            {JSON.stringify(identity.beliefs, null, 2)}
          </pre>
        </div>
        <div>
          <div className="text-white">Open Loops</div>
          <pre className="mt-2 text-secondary whitespace-pre-wrap">
            {JSON.stringify(identity.open_loops, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
