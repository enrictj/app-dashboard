import { PageHeader } from "@/components/layout/page-header";
import { HabitFormDialog } from "@/features/habits/habit-form-dialog";
import { HabitsView } from "@/features/habits/habits-view";
import { getHabitsWithCompletions, enrichHabit } from "@/services/habits.service";
import { t } from "@/lib/i18n/ca";

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
        title={t.habits.title}
        description={t.habits.description}
        action={<HabitFormDialog />}
      />
      {enriched.length === 0 ? (
        <p className="text-muted-foreground">{t.habits.empty}</p>
      ) : (
        <HabitsView habits={enriched} />
      )}
    </div>
  );
}
