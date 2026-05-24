import { startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { calculateStreak, isCompletedOnDate } from "@/lib/habits";
import type { HabitWithCompletions } from "@/lib/habits";

export async function getHabitsWithCompletions() {
  return prisma.habit.findMany({
    include: {
      completions: { orderBy: { date: "desc" } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTodayHabits() {
  const habits = await getHabitsWithCompletions();
  const today = startOfDay(new Date());
  return habits.map((habit) => ({
    ...habit,
    streak: calculateStreak(habit, today),
    completedToday: isCompletedOnDate(habit, today),
  }));
}

export async function getHabitStats() {
  const habits = await getHabitsWithCompletions();
  const today = startOfDay(new Date());
  return habits.map((h) => ({
    id: h.id,
    name: h.name,
    streak: calculateStreak(h, today),
    totalCompletions: h.completions.length,
    category: h.category,
    color: h.color,
  }));
}

export async function getAllCompletions() {
  return prisma.habitCompletion.findMany({
    orderBy: { date: "asc" },
  });
}

export function enrichHabit(habit: HabitWithCompletions) {
  const today = startOfDay(new Date());
  return {
    ...habit,
    streak: calculateStreak(habit, today),
    completedToday: isCompletedOnDate(habit, today),
  };
}
