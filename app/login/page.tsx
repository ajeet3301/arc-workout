"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-medium">Welcome to Arc</h1>
        <p className="mt-1 text-sm text-secondary">Sign in to keep your streaks going.</p>

        <Button variant="secondary" className="mt-6 w-full" onClick={handleGoogleSignIn}>
          <i className="ti ti-brand-google text-base" aria-hidden="true" />
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-secondary">
          <div className="h-px flex-1 bg-border/10" />
          or
          <div className="h-px flex-1 bg-border/10" />
        </div>

        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-border/20 bg-transparent px-4 py-2.5 text-sm outline-none focus-visible:border-accent"
          />
          <Button type="submit" variant="primary" disabled={status === "sending"}>
            {status === "sending" ? "Sending link…" : "Send magic link"}
          </Button>
        </form>

        {status === "sent" && (
          <p className="mt-3 text-sm text-success">Check your email for a sign-in link.</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-500">Something went wrong. Try again.</p>
        )}
      </Card>
    </main>
  );
}
