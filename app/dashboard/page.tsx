"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";
import { HabitRow } from "@/components/HabitRow";
import { StatCard } from "@/components/StatCard";
import type { Habit } from "@/types/database";

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profile }, { data: habitRows }, { data: logs }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).single(),
        supabase.from("habits").select("*").eq("user_id", user.id).eq("archived", false),
        supabase.from("habit_logs").select("habit_id").eq("user_id", user.id).eq("completed_on", today),
      ]);

      setDisplayName(profile?.display_name ?? "there");
      setHabits(habitRows ?? []);
      setCompletedToday(new Set((logs ?? []).map((l) => l.habit_id)));
      setLoading(false);
    }
    load();
  }, []);

  async function toggleHabit(habitId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const isCompleted = completedToday.has(habitId);
    const next = new Set(completedToday);

    if (isCompleted) {
      await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("completed_on", today);
      next.delete(habitId);
    } else {
      await supabase.from("habit_logs").insert({ habit_id: habitId, user_id: user.id, completed_on: today });
      next.add(habitId);
    }
    setCompletedToday(next);
  }

  const doneCount = completedToday.size;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <p className="text-sm text-secondary">Good to see you, {displayName}</p>
          <h1 className="mt-1 text-2xl font-medium">
            {doneCount} of {habits.length} habits done today
          </h1>
        </motion.div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatCard label="Today" value={`${doneCount}/${habits.length || 0}`} />
          <StatCard label="Active habits" value={habits.length} />
          <StatCard label="This week" value="—" />
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-secondary">Today</h2>
          {loading ? (
            <p className="text-sm text-secondary">Loading…</p>
          ) : habits.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-sm text-secondary">No habits yet. Add your first one to get started.</p>
              <a href="/habits" className="mt-3 inline-block text-sm text-accent">
                Set up habits →
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {habits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  completed={completedToday.has(habit.id)}
                  onToggle={toggleHabit}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
