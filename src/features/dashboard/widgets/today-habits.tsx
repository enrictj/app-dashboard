"use client";

import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { WidgetHeader } from "@/components/widgets/widget-header";
import { toggleHabitCompletion } from "@/features/habits/actions";
import { cn } from "@/lib/utils";

type HabitItem = {
  id: string;
  name: string;
  color: string;
  streak: number;
  completedToday: boolean;
  category: string;
};

export function TodayHabitsWidget({ habits }: { habits: HabitItem[] }) {
  const completed = habits.filter((h) => h.completedToday).length;

  return (
    <GlassCard className="col-span-4 row-span-2 flex h-full flex-col lg:col-span-3">
      <WidgetHeader
        title="Today's habits"
        subtitle={`${completed}/${habits.length} completed`}
      />
      <div className="flex-1 space-y-2 overflow-auto">
        {habits.length === 0 ? (
          <p className="text-sm text-muted-foreground">No habits yet.</p>
        ) : (
          habits.map((habit, i) => (
            <motion.button
              key={habit.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggleHabitCompletion(habit.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border border-border/40 px-3 py-2 text-left transition-colors hover:bg-muted/40",
                habit.completedToday && "bg-muted/30"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
                  habit.completedToday
                    ? "border-transparent text-white"
                    : "border-border"
                )}
                style={
                  habit.completedToday
                    ? { backgroundColor: habit.color }
                    : undefined
                }
              >
                {habit.completedToday && <Check className="h-3 w-3" />}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">
                {habit.name}
              </span>
              {habit.streak > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-500">
                  <Flame className="h-3 w-3" />
                  {habit.streak}
                </span>
              )}
            </motion.button>
          ))
        )}
      </div>
    </GlassCard>
  );
}
