import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-black/5 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo_2.png"
              alt="Student Saga"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <div>
              <div className="text-sm font-semibold text-brand-ink">
                Student Saga
              </div>
              <div className="text-xs text-brand-muted">
                SLIIT university-based game showcase
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-muted">
            <Link href="/" className="hover:text-brand-ink">
              Home
            </Link>
            <Link href="/signin" className="hover:text-brand-ink">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-brand-ink">
              Create account
            </Link>
            <Link href="/topup" className="hover:text-brand-ink">
              Top up
            </Link>
          </div>
        </div>

        <div className="mt-8 text-xs text-brand-muted">
          © {new Date().getFullYear()} Student Saga. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
