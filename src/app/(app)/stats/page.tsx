import {
  startOfWeek,
  eachDayOfInterval,
  endOfWeek,
  getDay,
  startOfDay,
  subDays,
} from "date-fns";
import { StatsDashboard } from "@/features/stats/stats-dashboard";
import {
  getHabitsWithCompletions,
  getAllCompletions,
} from "@/services/habits.service";
import { buildHeatmapData, completionRate, calculateStreak } from "@/lib/habits";
import { formatDateCa } from "@/lib/i18n/dates";
import { t } from "@/lib/i18n/ca";
import { prisma } from "@/lib/prisma";

export default async function StatsPage() {
  const [habits, completions, totalNotes] = await Promise.all([
    getHabitsWithCompletions(),
    getAllCompletions(),
    prisma.note.count(),
  ]);

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const days = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(now, { weekStartsOn: 1 }),
  });

  // Weekly bar/line chart data
  const weeklyData = days.map((day) => ({
    day: formatDateCa(day, "EEE"),
    completions: completions.filter((c) => {
      const d = startOfDay(c.date);
      return d.getTime() === startOfDay(day).getTime();
    }).length,
    total: habits.length,
  }));

  // Heatmap (52 weeks = 364 days)
  const heatmap = buildHeatmapData(completions, 52);

  // Per-habit completion rates (30 days) + streak
  const habitRates = habits.map((h) => {
    const limitDate = subDays(startOfDay(new Date()), 30);
    const count30 = h.completions.filter((c) => startOfDay(c.date) >= limitDate).length;
    return {
      name: h.name,
      rate: completionRate(h.completions, 30),
      color: h.color,
      streak: calculateStreak(h),
      category: h.category,
      count30,
    };
  });

  // Best days of week
  const dayCounts = new Map<number, number>();
  for (const c of completions) {
    const d = getDay(c.date);
    dayCounts.set(d, (dayCounts.get(d) ?? 0) + 1);
  }
  const bestDays = [...dayCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([day, count]) => ({ day: t.stats.dayNames[day], count }));

  // Quick stats
  const last7 = Array.from({ length: 7 }, (_, i) =>
    startOfDay(subDays(now, i)).toISOString().slice(0, 10)
  );
  const dailyHabits = habits.filter((h) => h.frequency === "daily");
  const possible = dailyHabits.length * 7;
  const done7 = last7.reduce(
    (acc, date) =>
      acc +
      dailyHabits.filter((h) =>
        h.completions.some(
          (c) => startOfDay(c.date).toISOString().slice(0, 10) === date
        )
      ).length,
    0
  );
  const weeklyRate = possible > 0 ? Math.round((done7 / possible) * 100) : 0;
  const bestStreak =
    habits.length > 0
      ? Math.max(...habits.map((h) => calculateStreak(h)))
      : 0;

  const quickStats = {
    totalHabits: habits.length,
    weeklyRate,
    bestStreak,
    totalNotes,
  };

  return (
    <div>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 600, color: "var(--text1)" }}>
          {t.stats.title}
        </h1>
        {t.stats.description && (
          <p style={{ marginTop: 4, fontSize: 14, color: "var(--text3)" }}>
            {t.stats.description}
          </p>
        )}
      </header>
      <StatsDashboard
        weeklyData={weeklyData}
        heatmap={heatmap}
        habitRates={habitRates}
        bestDays={bestDays}
        quickStats={quickStats}
      />
    </div>
  );
}
