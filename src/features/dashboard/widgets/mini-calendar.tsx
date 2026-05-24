"use client";

import { useMemo } from "react";
import {
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { WidgetHeader } from "@/components/widgets/widget-header";
import { getCalendarGrid } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, type EventCategory } from "@/types";

type EventDot = { date: Date; category: string };

export function MiniCalendarWidget({ events }: { events: EventDot[] }) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const days = useMemo(() => getCalendarGrid(month), [month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const e of events) {
      const key = format(e.date, "yyyy-MM-dd");
      const colors = map.get(key) ?? [];
      const color =
        CATEGORY_COLORS[e.category as EventCategory] ?? "#6366f1";
      if (!colors.includes(color)) colors.push(color);
      map.set(key, colors);
    }
    return map;
  }, [events]);

  return (
    <GlassCard className="col-span-4 row-span-2 lg:col-span-3">
      <WidgetHeader
        title="Calendar"
        subtitle={format(month, "MMMM yyyy")}
        action={
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setMonth(subMonths(month, 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setMonth(addMonths(month, 1))}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dots = eventsByDay.get(key) ?? [];
          return (
            <div
              key={key}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-md text-[11px]",
                !isSameMonth(day, month) && "text-muted-foreground/40",
                isToday(day) && "bg-primary/15 font-semibold text-primary"
              )}
            >
              {format(day, "d")}
              {dots.length > 0 && (
                <div className="absolute bottom-0.5 flex gap-0.5">
                  {dots.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
