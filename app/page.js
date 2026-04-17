import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
          <div className="flex items-center justify-center md:justify-start">
          <Image
            src="/logo_2.png"
            alt="Student Saga logo"
            width={1000}
            height={1000}
            priority
            className="h-auto w-[420px] sm:w-[720px] md:w-[980px] lg:w-[1100px] xl:w-[1200px]"
          />
          </div>

          <div className="max-w-2xl space-y-6 md:pl-6 lg:pl-10">
           
            <p className="text-base leading-7 text-brand-muted sm:text-lg lg:text-xl">
            A SLIIT university-based game concept that turns student life into a
            quest-driven adventure. Explore locations, complete missions, and
            progress through your own campus saga. And best of all, you can connect with your unknown classmates and make new friends along the way!
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-brand-coral px-5 text-sm font-semibold text-white hover:opacity-90"
              >
                Create account
              </Link>
              <Link
                href="/topup"
                className="inline-flex h-11 items-center justify-center rounded-md border border-brand-ink/20 bg-white px-5 text-sm font-semibold text-brand-ink hover:bg-brand-sand/30"
              >
                Top up
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-muted">
              <a href="#concepts" className="hover:text-brand-ink">
                Concepts
              </a>
              <a href="#features" className="hover:text-brand-ink">
                Features
              </a>
              <a href="#security" className="hover:text-brand-ink">
                Security
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <section id="concepts" className="mt-14 border-t border-black/5 pt-10">
          <h2 className="text-xl font-semibold text-brand-ink">Core concepts</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Campus exploration",
                body: "Navigate a SLIIT-inspired world with meaningful locations and interactions.",
              },
              {
                title: "Missions & quests",
                body: "Complete tasks, unlock chapters, and progress your student journey.",
              },
              {
                title: "Progression system",
                body: "Earn rewards, collect items, and grow your character over time.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-black/10 bg-white p-5"
              >
                <div className="text-sm font-semibold text-brand-ink">
                  {card.title}
                </div>
                <div className="mt-2 text-sm leading-6 text-brand-muted">
                  {card.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mt-14 border-t border-black/5 pt-10">
          <h2 className="text-xl font-semibold text-brand-ink">
            Website features
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Account creation & sign in",
                body: "Create an account, sign in, and manage your profile in a simple demo flow.",
              },
              {
                title: "Online top up (demo)",
                body: "Top up your balance (simulation) to represent in-game currency purchases.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-black/10 bg-white p-5"
              >
                <div className="text-sm font-semibold text-brand-ink">
                  {card.title}
                </div>
                <div className="mt-2 text-sm leading-6 text-brand-muted">
                  {card.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="security" className="mt-14 border-t border-black/5 pt-10">
          <h2 className="text-xl font-semibold text-brand-ink">
            Security basics
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-brand-muted">
            This demo uses server-side validation, hashed passwords, secure
            session cookies, rate limiting on auth/top up endpoints, and common
            security headers to reduce typical web risks.
          </p>
        </section>
      </div>
    </div>
  );
}
