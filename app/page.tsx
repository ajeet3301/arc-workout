import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="text-base font-medium">Arc</span>
        <Link href="/login">
          <Button variant="secondary">Sign in</Button>
        </Link>
      </nav>

      <section className="mx-auto max-w-2xl px-6 pt-20 pb-24 text-center md:pt-32">
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
          Build habits that actually stick
        </h1>
        <p className="mt-5 text-lg text-secondary">
          Track anything — workouts, water, sleep, reading, whatever matters to you.
          One calm dashboard, honest streaks, and an AI coach when you need a nudge.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/login">
            <Button variant="primary">Get started free</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-6 pb-24 md:grid-cols-3">
        {[
          {
            icon: "ti-list-check",
            title: "Track anything",
            body: "Define your own habits — no rigid program forced on you.",
          },
          {
            icon: "ti-flame",
            title: "See your streaks",
            body: "A clean, honest view of your consistency over time.",
          },
          {
            icon: "ti-message-circle",
            title: "AI coach on demand",
            body: "Ask for motivation or advice whenever you need it.",
          },
        ].map((f) => (
          <div key={f.title} className="card p-6">
            <i className={`ti ${f.icon} text-2xl text-accent`} aria-hidden="true" />
            <h3 className="mt-3 text-base font-medium">{f.title}</h3>
            <p className="mt-1 text-sm text-secondary">{f.body}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-border/10 px-6 py-8 text-center text-sm text-secondary">
        Arc — free, always.
      </footer>
    </main>
  );
}
