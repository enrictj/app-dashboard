import { addDays, isSameDay, startOfDay, subDays } from "date-fns";
import type { Habit, HabitCompletion } from "@prisma/client";

export type HabitWithCompletions = Habit & { completions: HabitCompletion[] };

export function calculateStreak(
  habit: HabitWithCompletions,
  referenceDate = new Date()
): number {
  const completionDates = habit.completions
    .map((c) => startOfDay(c.date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (completionDates.length === 0) return 0;

  let streak = 0;
  let cursor = startOfDay(referenceDate);

  if (habit.frequency === "weekly") {
    const weekStart = startOfDay(cursor);
    const hasThisWeek = completionDates.some(
      (d) => d >= subDays(weekStart, 6) && d <= weekStart
    );
    if (!hasThisWeek) {
      const lastWeek = subDays(weekStart, 7);
      const hasLastWeek = completionDates.some(
        (d) => d >= subDays(lastWeek, 6) && d <= lastWeek
      );
      if (!hasLastWeek) return 0;
      cursor = lastWeek;
    }
    while (true) {
      const weekEnd = cursor;
      const weekStartDate = subDays(weekEnd, 6);
      const completed = completionDates.some(
        (d) => d >= weekStartDate && d <= weekEnd
      );
      if (!completed) break;
      streak++;
      cursor = subDays(weekEnd, 7);
    }
    return streak;
  }

  const completedToday = completionDates.some((d) => isSameDay(d, cursor));
  if (!completedToday) {
    cursor = subDays(cursor, 1);
  }

  while (completionDates.some((d) => isSameDay(d, cursor))) {
    streak++;
    cursor = subDays(cursor, 1);
  }

  return streak;
}

export function isCompletedOnDate(
  habit: HabitWithCompletions,
  date: Date
): boolean {
  return habit.completions.some((c) => isSameDay(c.date, date));
}

export function completionRate(
  completions: HabitCompletion[],
  days: number
): number {
  const uniqueDays = new Set(
    completions.map((c) => startOfDay(c.date).toISOString())
  );
  return Math.round((uniqueDays.size / days) * 100);
}

export function buildHeatmapData(
  completions: { date: Date }[],
  weeks = 12
): { date: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of completions) {
    const key = startOfDay(c.date).toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const data: { date: string; count: number }[] = [];
  const end = startOfDay(new Date());
  const start = subDays(end, weeks * 7);

  let cursor = start;
  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);
    data.push({ date: key, count: counts.get(key) ?? 0 });
    cursor = addDays(cursor, 1);
  }
  return data;
}
