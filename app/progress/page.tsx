"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";

type StreakEntry = { habitId: string; name: string; streak: number };

export default function ProgressPage() {
  const [streaks, setStreaks] = useState<StreakEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/streaks")
      .then((res) => res.json())
      .then((data) => setStreaks(data.streaks ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-medium">Progress</h1>
        <p className="mt-1 text-sm text-secondary">Your current streak per habit.</p>

        {loading ? (
          <p className="mt-6 text-sm text-secondary">Loading…</p>
        ) : streaks.length === 0 ? (
          <p className="mt-6 text-sm text-secondary">No habits yet — add one to start building a streak.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {streaks.map((s) => (
              <StatCard key={s.habitId} label={s.name} value={`${s.streak} day${s.streak === 1 ? "" : "s"}`} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
