import { format, formatDistanceToNow } from "date-fns";
import { AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { WidgetHeader } from "@/components/widgets/widget-header";
import { Badge } from "@/components/ui/badge";
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
      <WidgetHeader title="Upcoming" subtitle="Deadlines & exams" />
      <div className="space-y-2">
        {deadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing due soon.</p>
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
                    {format(new Date(d.date), "MMM d")} ·{" "}
                    {formatDistanceToNow(new Date(d.date), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {d.category}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}
