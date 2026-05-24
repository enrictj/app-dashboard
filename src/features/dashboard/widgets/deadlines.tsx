import { formatDistanceToNow } from "date-fns";
import { ca as dateFnsCa } from "date-fns/locale";
import { AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { WidgetHeader } from "@/components/widgets/widget-header";
import { Badge } from "@/components/ui/badge";
import { eventCategoryLabel } from "@/lib/i18n/ca";
import { formatDateCa } from "@/lib/i18n/dates";
import { t } from "@/lib/i18n/ca";
import { CATEGORY_COLORS, type EventCategory } from "@/types";

type Deadline = {
  id: string;
  title: string;
  date: Date;
  category: string;
};

export function DeadlinesWidget({ deadlines }: { deadlines: Deadline[] }) {
  return (
    <GlassCard className="col-span-4 row-span-2 lg:col-span-2">
      <WidgetHeader title={t.dashboard.upcoming} subtitle={t.dashboard.deadlinesExams} />
      <div className="space-y-2">
        {deadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.dashboard.nothingDue}</p>
        ) : (
          deadlines.map((d) => {
            const color =
              CATEGORY_COLORS[d.category as EventCategory] ?? "#f59e0b";
            return (
              <div
                key={d.id}
                className="flex items-start gap-3 rounded-lg border border-border/40 px-3 py-2"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateCa(new Date(d.date), "d MMM")} ·{" "}
                    {formatDistanceToNow(new Date(d.date), {
                      addSuffix: true,
                      locale: dateFnsCa,
                    })}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {eventCategoryLabel(d.category)}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}
