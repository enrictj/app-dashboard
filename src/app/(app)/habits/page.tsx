import { PageHeader } from "@/components/layout/page-header";
import { HabitFormDialog } from "@/features/habits/habit-form-dialog";
import { HabitsView } from "@/features/habits/habits-view";
import { getHabitsWithCompletions, enrichHabit } from "@/services/habits.service";

export default async function HabitsPage() {
  const habits = await getHabitsWithCompletions();
  const enriched = habits.map((h) => {
    const e = enrichHabit(h);
    return {
      id: h.id,
      name: h.name,
      description: h.description,
      frequency: h.frequency,
      category: h.category,
      color: h.color,
      streak: e.streak,
      completedToday: e.completedToday,
      totalCompletions: h.completions.length,
    };
  });

  return (
    <div>
      <PageHeader
        title="Habit Tracker"
        description="Build consistency with streaks and categories"
        action={<HabitFormDialog />}
      />
      {enriched.length === 0 ? (
        <p className="text-muted-foreground">
          No habits yet. Create your first habit to get started.
        </p>
      ) : (
        <HabitsView habits={enriched} />
      )}
    </div>
  );
}
