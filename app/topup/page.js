"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TopupPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(500);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function loadMe() {
    const res = await fetch("/api/me", { cache: "no-store" });
    if (!res.ok) {
      setUser(null);
      return;
    }
    const data = await res.json();
    setUser(data?.user ?? null);
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setUser(null);
          return;
        }
        const data = await res.json();
        if (!cancelled) setUser(data?.user ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onTopup(e) {
    e.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      const parsedAmount = Number(amount);
      const res = await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parsedAmount }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data?.error || "Top up failed");
        return;
      }

      setMessage("Top up successful");
      await loadMe();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-brand-ink">
        Online top up (demo)
      </h1>
      <p className="mt-2 text-sm text-brand-muted">
        This is a simulated top up flow for the Student Saga showcase.
      </p>

      {loading ? (
        <div className="mt-6 text-sm text-brand-muted">Loading…</div>
      ) : user ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <div className="text-sm font-semibold text-brand-ink">Balance</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-brand-ink">
              {user.balance ?? 0}
            </div>
            <div className="mt-1 text-xs text-brand-muted">
              Signed in as {user.email}
            </div>
          </div>

          <form
            onSubmit={onTopup}
            className="rounded-lg border border-black/10 bg-white p-6"
          >
            <div className="text-sm font-semibold text-brand-ink">
              Choose amount
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[500, 1000, 2500].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className={`h-10 rounded-md border px-3 text-sm font-semibold ${
                    Number(amount) === v
                      ? "border-brand-coral bg-brand-coral/10 text-brand-ink"
                      : "border-black/10 bg-white text-brand-muted hover:bg-black/5"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <label className="mt-4 block">
              <div className="mb-1 text-sm font-semibold text-brand-ink">
                Custom amount
              </div>
              <input
                type="number"
                min={100}
                max={100000}
                step={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-11 w-full rounded-md border border-black/10 px-3 outline-none focus:border-brand-ink/40"
              />
            </label>

            {message ? (
              <div className="mt-4 rounded-md border border-black/10 bg-black/5 px-3 py-2 text-sm text-brand-ink">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand-coral px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Processing…" : "Top up"}
            </button>

            <div className="mt-2 text-xs text-brand-muted">
              Note: real payment gateway integration is not included.
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
          <div className="text-sm text-brand-muted">
            Please sign in to top up your balance.
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/signin"
              className="inline-flex h-10 items-center justify-center rounded-md bg-brand-coral px-4 text-sm font-semibold text-white hover:opacity-90"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-md border border-brand-ink/20 bg-white px-4 text-sm font-semibold text-brand-ink hover:bg-brand-sand/30"
            >
              Create account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
