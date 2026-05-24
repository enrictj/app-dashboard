import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { PageHeader } from "@/components/layout/page-header";
import { TodayHabitsWidget } from "@/features/dashboard/widgets/today-habits";
import { MiniCalendarWidget } from "@/features/dashboard/widgets/mini-calendar";
import { ProductivityStatsWidget } from "@/features/dashboard/widgets/productivity-stats";
import { CuriosityWidget } from "@/features/dashboard/widgets/curiosity";
import { QuickNotesWidget } from "@/features/dashboard/widgets/quick-notes";
import { DeadlinesWidget } from "@/features/dashboard/widgets/deadlines";
import { getTodayHabits } from "@/services/habits.service";
import { getEventsForMonth, getUpcomingDeadlines } from "@/services/events.service";
import { getQuickNotes } from "@/services/notes.service";
import { getDailyFact } from "@/lib/facts";
import { completionRate } from "@/lib/habits";
import { getAllCompletions } from "@/services/habits.service";
export default async function DashboardPage() {
  const now = new Date();
  const [habits, events, deadlines, quickNotes, completions] =
    await Promise.all([
      getTodayHabits(),
      getEventsForMonth(now),
      getUpcomingDeadlines(5),
      getQuickNotes(),
      getAllCompletions(),
    ]);

  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekCompletions = completions.filter((c) =>
    isWithinInterval(c.date, { start: weekStart, end: weekEnd })
  );
  const rate = completionRate(weekCompletions, 7);
  const activeStreaks = habits.filter((h) => h.streak > 0).length;
  const eventsThisWeek = events.filter((e) =>
    isWithinInterval(e.date, { start: weekStart, end: weekEnd })
  ).length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={format(now, "EEEE, MMMM d")}
      />
      <div className="grid auto-rows-[minmax(120px,auto)] grid-cols-4 gap-4 lg:grid-cols-12">
        <TodayHabitsWidget
          habits={habits.map((h) => ({
            id: h.id,
            name: h.name,
            color: h.color,
            streak: h.streak,
            completedToday: h.completedToday,
            category: h.category,
          }))}
        />
        <MiniCalendarWidget
          events={events.map((e) => ({
            date: e.date,
            category: e.category,
          }))}
        />
        <ProductivityStatsWidget
          completionRate={rate}
          activeStreaks={activeStreaks}
          eventsThisWeek={eventsThisWeek}
        />
        <CuriosityWidget fact={getDailyFact(now)} />
        <QuickNotesWidget notes={quickNotes} />
        <DeadlinesWidget
          deadlines={deadlines.map((d) => ({
            id: d.id,
            title: d.title,
            date: d.date,
            category: d.category,
          }))}
        />
      </div>
    </div>
  );
}
