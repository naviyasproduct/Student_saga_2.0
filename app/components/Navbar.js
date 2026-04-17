"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
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
  }, [pathname]);

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-black/5 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo_2.png"
            alt="Student Saga"
            width={44}
            height={44}
            className="h-11 w-11"
            priority
          />
          
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-brand-muted md:flex">
          <Link href="/#concepts" className="hover:text-brand-ink">
            Concepts
          </Link>
          <Link href="/#features" className="hover:text-brand-ink">
            Features
          </Link>
          <Link href="/topup" className="hover:text-brand-ink">
            Top up
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-xs text-brand-muted">Loading…</span>
          ) : user ? (
            <>
              <Link
                href="/account"
                className="hidden rounded-md px-3 py-2 text-sm font-semibold text-brand-ink hover:bg-black/5 sm:inline-flex"
              >
                Account
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-10 items-center justify-center rounded-md bg-brand-coral px-4 text-sm font-semibold text-white hover:opacity-90"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-brand-ink hover:bg-black/5"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-md bg-brand-coral px-4 text-sm font-semibold text-white hover:opacity-90"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
