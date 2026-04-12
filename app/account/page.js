"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
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

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-brand-ink">
        Account
      </h1>

      {loading ? (
        <div className="mt-6 text-sm text-brand-muted">Loading…</div>
      ) : user ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <div className="text-sm font-semibold text-brand-ink">Profile</div>
            <div className="mt-3 space-y-2 text-sm text-brand-muted">
              <div>
                <span className="font-semibold text-brand-ink">Username:</span>{" "}
                {user.username}
              </div>
              <div>
                <span className="font-semibold text-brand-ink">Email:</span>{" "}
                {user.email}
              </div>
              <div>
                <span className="font-semibold text-brand-ink">Joined:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <div className="text-sm font-semibold text-brand-ink">
              Balance
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-brand-ink">
              {user.balance ?? 0}
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/topup"
                className="inline-flex h-10 items-center justify-center rounded-md bg-brand-coral px-4 text-sm font-semibold text-white hover:opacity-90"
              >
                Top up
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-10 items-center justify-center rounded-md border border-brand-ink/20 bg-white px-4 text-sm font-semibold text-brand-ink hover:bg-brand-sand/30"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
          <div className="text-sm text-brand-muted">
            You’re not signed in.
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
