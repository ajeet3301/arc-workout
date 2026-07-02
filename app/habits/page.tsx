"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import type { Habit } from "@/types/database";

const ICON_OPTIONS = ["ti-barbell", "ti-glass-full", "ti-moon", "ti-book", "ti-yoga", "ti-walk", "ti-circle"];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function loadHabits() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("archived", false)
      .order("created_at", { ascending: false });
    setHabits(data ?? []);
  }

  useEffect(() => {
    loadHabits();
  }, []);

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("habits").insert({ user_id: user.id, name: name.trim(), icon });
      setName("");
      await loadHabits();
    }
    setSaving(false);
  }

  async function archiveHabit(id: string) {
    await supabase.from("habits").update({ archived: true }).eq("id", id);
    await loadHabits();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-medium">Your habits</h1>
        <p className="mt-1 text-sm text-secondary">Define whatever matters to you — no presets required.</p>

        <form onSubmit={addHabit} className="mt-6 card flex flex-col gap-3 p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Read 20 minutes"
            className="rounded-xl border border-border/20 bg-transparent px-4 py-2.5 text-sm outline-none focus-visible:border-accent"
          />
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setIcon(opt)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-base ${
                  icon === opt ? "border-accent text-accent" : "border-border/20 text-secondary"
                }`}
                aria-label={opt}
              >
                <i className={`ti ${opt}`} aria-hidden="true" />
              </button>
            ))}
          </div>
          <Button type="submit" variant="primary" disabled={saving} className="self-start">
            Add habit
          </Button>
        </form>

        <div className="mt-8 flex flex-col gap-2">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between rounded-xl border border-border/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <i className={`ti ${habit.icon}`} aria-hidden="true" />
                <span className="text-sm">{habit.name}</span>
              </div>
              <button onClick={() => archiveHabit(habit.id)} className="text-xs text-secondary hover:text-red-500">
                Archive
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
