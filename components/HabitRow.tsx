"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { Habit } from "@/types/database";

interface HabitRowProps {
  habit: Habit;
  completed: boolean;
  onToggle: (habitId: string) => void;
}

export function HabitRow({ habit, completed, onToggle }: HabitRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <i className={clsx("ti text-lg", habit.icon || "ti-circle", completed ? "text-success" : "text-secondary")} />
        <span className="text-sm">{habit.name}</span>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(habit.id)}
        className={clsx(
          "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150",
          completed ? "text-secondary" : "border border-border/20 hover:bg-surface/5"
        )}
      >
        {completed ? "Done" : "Mark done"}
      </motion.button>
    </div>
  );
}
