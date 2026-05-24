"use client";

import { motion } from "framer-motion";
import { Check, Flame, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleHabitCompletion, deleteHabit } from "@/features/habits/actions";
import { cn } from "@/lib/utils";

export type HabitRow = {
  id: string;
  name: string;
  description: string | null;
  frequency: string;
  category: string;
  color: string;
  streak: number;
  completedToday: boolean;
  totalCompletions: number;
};

export function HabitsView({ habits }: { habits: HabitRow[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {habits.map((habit, i) => (
        <motion.div
          key={habit.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <GlassCard className="flex flex-col">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <h3 className="font-medium">{habit.name}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => deleteHabit(habit.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            {habit.description && (
              <p className="mb-3 text-xs text-muted-foreground">
                {habit.description}
              </p>
            )}
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-[10px]">
                {habit.frequency}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {habit.category}
              </Badge>
              {habit.streak > 0 && (
                <Badge className="gap-1 bg-amber-500/10 text-amber-500 text-[10px]">
                  <Flame className="h-3 w-3" />
                  {habit.streak} streak
                </Badge>
              )}
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {habit.totalCompletions} completions
              </span>
              <Button
                size="sm"
                variant={habit.completedToday ? "secondary" : "outline"}
                className="gap-1.5"
                onClick={() => toggleHabitCompletion(habit.id)}
              >
                <Check
                  className={cn(
                    "h-3.5 w-3.5",
                    habit.completedToday && "text-emerald-500"
                  )}
                />
                {habit.completedToday ? "Done today" : "Complete"}
              </Button>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: habit.color }}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (habit.totalCompletions / 30) * 100)}%`,
                }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
