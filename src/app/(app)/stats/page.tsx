import {
  startOfWeek,
  eachDayOfInterval,
  endOfWeek,
  getDay,
} from "date-fns";
import { PageHeader } from "@/components/layout/page-header";
import { StatsDashboard } from "@/features/stats/stats-dashboard";
import { getHabitsWithCompletions, getAllCompletions } from "@/services/habits.service";
import { buildHeatmapData, completionRate } from "@/lib/habits";
import { startOfDay } from "date-fns";
import { formatDateCa } from "@/lib/i18n/dates";
import { t } from "@/lib/i18n/ca";

export default async function StatsPage() {
  const [habits, completions] = await Promise.all([
    getHabitsWithCompletions(),
    getAllCompletions(),
  ]);

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const days = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(now, { weekStartsOn: 1 }),
  });

  const weeklyData = days.map((day) => ({
    day: formatDateCa(day, "EEE"),
    completions: completions.filter((c) => {
      const d = startOfDay(c.date);
      return d.getTime() === startOfDay(day).getTime();
    }).length,
  }));

  const heatmap = buildHeatmapData(completions, 12);

  const habitRates = habits.map((h) => ({
    name: h.name,
    rate: completionRate(h.completions, 30),
    color: h.color,
  }));

  const dayCounts = new Map<number, number>();
  for (const c of completions) {
    const d = getDay(c.date);
    dayCounts.set(d, (dayCounts.get(d) ?? 0) + 1);
  }
  const bestDays = [...dayCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([day, count]) => ({ day: t.stats.dayNames[day], count }));

  return (
    <div>
      <PageHeader
        title={t.stats.title}
        description={t.stats.description}
      />
      <StatsDashboard
        weeklyData={weeklyData}
        heatmap={heatmap}
        habitRates={habitRates}
        bestDays={bestDays}
      />
    </div>
  );
}
