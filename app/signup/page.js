"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Could not create account");
        return;
      }

      router.push("/account");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-brand-ink">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-brand-muted">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-brand-ink">
          Sign in
        </Link>
        .
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-lg border border-black/10 bg-white p-6"
      >
        <Field label="Username">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            maxLength={32}
            className="h-11 w-full rounded-md border border-black/10 px-3 outline-none focus:border-brand-ink/40"
            placeholder="Your name"
          />
        </Field>

        <Field label="Email">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="h-11 w-full rounded-md border border-black/10 px-3 outline-none focus:border-brand-ink/40"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Password">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            minLength={8}
            maxLength={72}
            className="h-11 w-full rounded-md border border-black/10 px-3 outline-none focus:border-brand-ink/40"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
          />
        </Field>

        {error ? (
          <div className="rounded-md border border-brand-coral/30 bg-brand-coral/10 px-3 py-2 text-sm text-brand-ink">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 w-full items-center justify-center rounded-md bg-brand-coral px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create account"}
        </button>

        <div className="text-xs text-brand-muted">
          This is a demo flow for showcasing Student Saga.
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-semibold text-brand-ink">{label}</div>
      {children}
    </label>
  );
}
