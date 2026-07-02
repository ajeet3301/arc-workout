"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
      const typedProfile = profile as { display_name: string | null } | null;
      setDisplayName(typedProfile?.display_name ?? "");
    }
    load();
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("arc-theme", next ? "dark" : "light");
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ display_name: displayName }).eq("id", user.id);
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-lg px-6 py-8">
        <h1 className="text-2xl font-medium">Settings</h1>

        <Card className="mt-6">
          <h2 className="text-sm font-medium">Profile</h2>
          <form onSubmit={saveProfile} className="mt-4 flex flex-col gap-3">
            <div>
              <label className="text-xs text-secondary">Display name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border/20 bg-transparent px-4 py-2.5 text-sm outline-none focus-visible:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-secondary">Email</label>
              <input
                value={email}
                disabled
                className="mt-1 w-full rounded-xl border border-border/20 bg-transparent px-4 py-2.5 text-sm text-secondary outline-none"
              />
            </div>
            <Button type="submit" variant="primary" disabled={saving} className="self-start">
              Save changes
            </Button>
          </form>
        </Card>

        <Card className="mt-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">Dark mode</h2>
            <p className="text-xs text-secondary">Switch between light and dark themes.</p>
          </div>
          <Button variant="secondary" onClick={toggleTheme}>
            {isDark ? "Switch to light" : "Switch to dark"}
          </Button>
        </Card>
      </main>
    </div>
  );
}
