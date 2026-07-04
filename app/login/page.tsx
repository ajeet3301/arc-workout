"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // Sign up or sign in — no verification email will be sent
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: crypto.randomUUID(), // random password — user never sees it
      options: {
        data: { display_name: name.trim() },
      },
    });

    if (signUpError && signUpError.message !== "User already registered") {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // If already registered, sign them in with OTP (no password needed)
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: false },
    });

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-medium">Welcome to Arc</h1>
        <p className="mt-1 text-sm text-secondary">
          Enter your name and Gmail — no password, no verification.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl border border-border/20 bg-transparent px-4 py-2.5 text-sm outline-none focus-visible:border-accent"
          />
          <input
            type="email"
            placeholder="your@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-border/20 bg-transparent px-4 py-2.5 text-sm outline-none focus-visible:border-accent"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Setting up…" : "Start tracking →"}
          </Button>
        </form>
      </Card>
    </main>
  );
}