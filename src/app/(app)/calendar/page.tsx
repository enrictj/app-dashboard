import { PageHeader } from "@/components/layout/page-header";
import { CalendarView } from "@/features/calendar/calendar-view";
import { getAllEvents } from "@/services/events.service";
import { t } from "@/lib/i18n/ca";

export default async function CalendarPage() {
  const events = await getAllEvents();

  return (
    <div>
      <PageHeader
        title={t.calendar.title}
        description={t.calendar.description}
      />
      <CalendarView
        events={events.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.date,
          category: e.category,
          color: e.color,
        }))}
      />
    </div>
  );
}
